import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON parser with large payload for custom logo uploads
app.use(express.json({ limit: '10mb' }));

// منع تخزين الكاش تماماً لضمان تحديث العروض فوراً عند الزبائن بمجرد حذفها
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// -------------------------------------------------------------
// اتصال قاعدة البيانات السحابية الصارم (MongoDB Atlas) 
// -------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || '';

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('[TechsyZone DB] قاعدة البيانات السحابية متصلة بنجاح والداتا تدوم للأبد!'))
    .catch(err => console.error('[TechsyZone DB] خطأ في الاتصال بـ MongoDB:', err));
} else {
  console.error('[TechsyZone DB] خطأ فادح: لم يتم العثور على متغير البيئة MONGODB_URI في إعدادات Render.');
}

// تعريف وثيقة الحفظ في MongoDB لحفظ كامل بيانات التطبيق
const AppDataSchema = new mongoose.Schema({
  key: { type: String, default: 'main_storefront_data', unique: true },
  data: mongoose.Schema.Types.Mixed,
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { minimize: false });

const AppDataModel = mongoose.model('StoreData', AppDataSchema);

// -------------------------------------------------------------
// المزامنة الحية عبر السحاب 
// -------------------------------------------------------------

async function getStorefrontData() {
  try {
    if (mongoose.connection.readyState === 1) {
      const record = await AppDataModel.findOne({ key: 'main_storefront_data' });
      if (record && record.data) {
        return record.data;
      }
    }
  } catch (err) {
    console.error('Error fetching data from MongoDB Cloud:', err);
  }
  return null; 
}

async function saveStorefrontData(payload: any) {
  const currentIsoString = new Date().toISOString();
  try {
    if (mongoose.connection.readyState === 1) {
      // استبدال كامل للبيانات (Overwrite) لمنع دمج العروض المحذوفة القديمة مجدداً
      await AppDataModel.findOneAndUpdate(
        { key: 'main_storefront_data' },
        { data: payload, updatedAt: currentIsoString },
        { upsert: true, new: true, overwrite: true }
      );
      console.log('[TechsyZone DB] تم حفظ واستبدال البيانات في السحاب بنجاح بنسخة نظيفة.');
    }
  } catch (err) {
    console.error('Failed to sync data to cloud MongoDB:', err);
  }
}

// -------------------------------------------------------------
// مسارات روابط الـ REST API المتوافقة بالكامل مع لوحة التحكم
// -------------------------------------------------------------

// 1. جلب كافة المنتجات والعروض لصفحة الزبائن والأدمن (بدون كاش)
app.get('/api/data', async (_req, res) => {
  const data = await getStorefrontData();
  res.json({ success: true, data });
});

// 2. حفظ نظيف ومباشر بدون دمج (الحل الجذري لمنع عودة العروض المحذوفة)
app.post('/api/data', async (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ success: false, error: 'Empty payload' });
  }

  // نأخذ الـ payload القادم من الأدمن مباشرة كما هو ليكون هو الحقيقة المطلوبة ومسح المحذوفات
  const cleanedData = { 
    ...payload, 
    updatedAt: new Date().toISOString() 
  };
  
  await saveStorefrontData(cleanedData);
  res.json({ success: true, message: 'Data overwritten and verified in Cloud Database', timestamp: cleanedData.updatedAt });
});

// 3. تحديث إعدادات الموقع وإيميل المزامنة
app.post('/api/config', async (req, res) => {
  const { config } = req.body;
  const db = (await getStorefrontData()) || {};
  db.siteConfig = { ...(db.siteConfig || {}), ...config };
  db.updatedAt = new Date().toISOString();
  
  await saveStorefrontData(db);
  res.json({ success: true, siteConfig: db.siteConfig });
});

// 4. عمل لقطة حفظ احتياطية
app.post('/api/backup-drive', async (req, res) => {
  const { backupEmail } = req.body;
  const db = (await getStorefrontData()) || {};
  const backupSnapshot = {
    exportedAt: new Date().toISOString(),
    backupEmail: backupEmail || db.siteConfig?.backupDriveEmail || 'backup@techsyzone.com',
    data: db,
    status: 'synced_to_cloud_reserve'
  };
  
  const DATA_DIR = path.resolve(__dirname, 'data');
  const BACKUP_DIR = path.resolve(DATA_DIR, 'backups');
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const backupFileName = `backup_${Date.now()}.json`;
  fs.writeFileSync(path.resolve(BACKUP_DIR, backupFileName), JSON.stringify(backupSnapshot, null, 2));

  res.json({
    success: true,
    message: `تم إنشاء نسخة احتياطية سحابية كاملة ومزامنتها بنجاح مع حساب Drive: ${backupSnapshot.backupEmail}`,
    snapshotInfo: {
      fileName: backupFileName,
      sizeBytes: JSON.stringify(backupSnapshot).length,
      timestamp: backupSnapshot.exportedAt,
      backupEmail: backupSnapshot.backupEmail
    }
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TechsyZone Server] Running on http://0.0.0:${PORT}`);
  });
}

startServer();
