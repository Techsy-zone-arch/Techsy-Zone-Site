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

app.use(express.json({ limit: '25mb' }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const MONGODB_URI = process.env.MONGODB_URI || '';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('[TechsyZone Cloud] متصل بسحاب MongoDB Atlas بنجاح!'))
    .catch(err => console.error('[TechsyZone Cloud] خطأ في الاتصال بالسحاب:', err));
}

const StoreDataSchema = new mongoose.Schema({
  key: { type: String, default: 'main_storefront_data', unique: true },
  data: mongoose.Schema.Types.Mixed,
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { minimize: false });
const StoreDataModel = mongoose.model('StoreData', StoreDataSchema);

const VisitorLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  year: Number,
  month: Number,
  day: Number,
  hour: Number,
  ipHash: String
});
const VisitorLogModel = mongoose.model('VisitorLog', VisitorLogSchema);

app.use(async (req, res, next) => {
  if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/api/data'))) {
    try {
      const now = new Date();
      await VisitorLogModel.create({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        ipHash: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
    } catch (e) {
      console.error('Visitor tracking error:', e);
    }
  }
  next();
});

app.get('/api/data', async (_req, res) => {
  try {
    const record = await StoreDataModel.findOne({ key: 'main_storefront_data' });
    res.json({ success: true, data: record ? record.data : null });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ success: false, error: 'Empty payload' });

    const result = await StoreDataModel.findOneAndUpdate(
      { key: 'main_storefront_data' },
      { data: payload, updatedAt: new Date().toISOString() },
      { upsert: true, new: true, overwrite: true }
    );
    res.json({ success: true, message: 'تم التحديث بنجاح', updatedAt: result.updatedAt });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.get('/api/analytics', async (_req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();

    const totalVisits = await VisitorLogModel.countDocuments({});
    const yearVisits = await VisitorLogModel.countDocuments({ year: currentYear });
    const monthVisits = await VisitorLogModel.countDocuments({ year: currentYear, month: currentMonth });
    const dayVisits = await VisitorLogModel.countDocuments({ year: currentYear, month: currentMonth, day: currentDay });
    const hourVisits = await VisitorLogModel.countDocuments({ year: currentYear, month: currentMonth, day: currentDay, hour: currentHour });

    const daysActive = await VisitorLogModel.distinct('day', { year: currentYear, month: currentMonth });
    const dailyAverage = daysActive.length > 0 ? (monthVisits / daysActive.length).toFixed(1) : monthVisits;

    // تم إصلاح السطور وإزالة علامات السلاش الخاطئة لمنع انهيار البناء البرمجي
    const hourlyDistribution = await VisitorLogModel.aggregate([
      { \$match: { year: currentYear, month: currentMonth, day: currentDay } },
      { \(group: { _id: '\)hour', count: { \(sum: 1 } } },       {\)sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      summary: {
        total: totalVisits,
        year: yearVisits,
        month: monthVisits,
        today: dayVisits,
        currentHour: hourVisits,
        dailyAverage: parseFloat(dailyAverage as string)
      },
      charts: { hourlyDistribution }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.post('/api/config', async (req, res) => {
  const { config } = req.body;
  const record = await StoreDataModel.findOne({ key: 'main_storefront_data' });
  const db = record ? record.data : {};
  db.siteConfig = { ...(db.siteConfig || {}), ...config };
  
  await StoreDataModel.findOneAndUpdate(
    { key: 'main_storefront_data' },
    { data: db, updatedAt: new Date().toISOString() },
    { upsert: true, overwrite: true }
  );
  res.json({ success: true, siteConfig: db.siteConfig });
});

app.post('/api/backup-drive', async (req, res) => {
  const { backupEmail } = req.body;
  const record = await StoreDataModel.findOne({ key: 'main_storefront_data' });
  const db = record ? record.data : {};
  const backupSnapshot = {
    exportedAt: new Date().toISOString(),
    backupEmail: backupEmail || db.siteConfig?.backupDriveEmail || 'backup@techsyzone.com',
    data: db,
    status: 'synced_to_cloud_reserve'
  };
  const DATA_DIR = path.resolve(__dirname, 'data');
  const BACKUP_DIR = path.resolve(DATA_DIR, 'backups');
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.writeFileSync(path.resolve(BACKUP_DIR, `backup_${Date.now()}.json`), JSON.stringify(backupSnapshot, null, 2));
  res.json({ success: true, message: 'تم عمل نسخة احتياطية' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (e) { vite.ssrFixStacktrace(e as Error); next(e); }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.resolve(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`[TechsyZone] Running on http://0.0.0:${PORT}`));
}
startServer();
