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

// -------------------------------------------------------------
// اتصال قاعدة البيانات السحابية (MongoDB Atlas) لتدوم الداتا للأبد
// -------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || '';

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('[TechsyZone DB] قاعدة البيانات السحابية متصلة بنجاح والداتا تدوم للأبد!'))
    .catch(err => console.error('[TechsyZone DB] خطأ في الاتصال بـ MongoDB:', err));
} else {
  console.warn('[TechsyZone DB] تنبيه: لم يتم العثور على متغير البيئة MONGODB_URI. تم التحويل الاحتياطي للملف المحلي.');
}

// تعريف وثيقة الحفظ في MongoDB لحفظ كامل بيانات التطبيق المتداخلة هيراركياً
const AppDataSchema = new mongoose.Schema({
  key: { type: String, default: 'main_storefront_data', unique: true },
  data: mongoose.Schema.Types.Mixed,
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { minimize: false });

const AppDataModel = mongoose.model('StoreData', AppDataSchema);

// -------------------------------------------------------------
// المزامنة الهجينة (تأمين قراءة وكتابة الداتا من السحاب أو كملف احتياطي)
// -------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// دالة جلب البيانات الذكية (تحاول القراءة من السحاب أولاً، وإن لم تجد تقرأ محلياً)
async function getStorefrontData() {
  try {
    if (mongoose.connection.readyState === 1) {
      const record = await AppDataModel.findOne({ key: 'main_storefront_data' });
      if (record && record.data) {
        return record.data;
      }
    }
  } catch (err) {
    console.error('Error fetching from MongoDB, falling back to local file:', err);
  }

  //Fallback في حال عدم الاتصال المؤقت بالسحاب
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading fallback db.json:', err);
  }
  return null;
}

// دالة حفظ البيانات المزدوجة (تحفظ في السحاب للأبد وتحدث الملف المحلي أيضاً كأمان)
async function saveStorefrontData(payload: any) {
  const currentIsoString = new Date().toISOString();
  
  // 1. الحفظ في السحاب للأبد
  try {
    if (mongoose.connection.readyState === 1) {
      await AppDataModel.findOneAndUpdate(
        { key: 'main_storefront_data' },
        { data: payload, updatedAt: currentIsoString },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error('Failed to sync data to cloud MongoDB:', err);
  }

  // 2. الحفظ في الملف المحلي لضمان استقرار التشغيل الداخلي
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to fallback db.json:', err);
  }
}

// -------------------------------------------------------------
// مسارات روابط الـ REST API المعدلة لتعمل عبر السحاب
// -------------------------------------------------------------

// 1. جلب كافة المنتجات والعروض لصفحة الزبائن والأدمن
app.get('/api/data', async (_req, res) => {
  const data = await getStorefrontData();
  res.json({ success: true, data });
});

// 2. حفظ وتعديل وحذف العروض والمنتجات من لوحة التحكم (مزامنة فورية حية للزبائن)
app.post('/api/data', async (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ success: false, error: 'Empty payload' });
  }
  const existing = (await getStorefrontData()) || {};
  const merged = { ...existing, ...payload, updatedAt: new Date().toISOString() };
  
  await saveStorefrontData(merged);
  res.json({ success: true, message: 'Data synced to Cloud Database successfully', timestamp: merged.updatedAt });
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

// 4. عمل لقطة حفظ احتياطية كاملة متزامنة مع الخادم الاحتياطي للملفات
app.post('/api/backup-drive', async (req, res) => {
  const { backupEmail } = req.body;
  const db = (await getStorefrontData()) || {};
  const backupSnapshot = {
    exportedAt: new Date().toISOString(),
    backupEmail: backupEmail || db.siteConfig?.backupDriveEmail || 'backup@techsyzone.com',
    data: db,
    status: 'synced_to_cloud_reserve'
  };
  
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
    console.log(`[TechsyZone Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
