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
// ميدل وير فرز وتجاهل الروبوتات وزيارات الأدمن لمنع تخريب العداد الحقيقي
app.use(async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isGet = req.method === 'GET';
  const isDataApi = req.url.startsWith('/api/data');
  const isHome = req.url === '/';

  const isSystemPingOrAdmin = userAgent.toLowerCase().includes('robot') || 
                              userAgent.toLowerCase().includes('cron') || 
                              userAgent.toLowerCase().includes('ping') ||
                              userAgent.toLowerCase().includes('uptimerobot') ||
                              req.headers['x-admin-request'] === 'true';

  if (isGet && (isHome || isDataApi) && !isSystemPingOrAdmin) {
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
      console.error('Visitor logging bypassed:', e);
    }
  }
  next();
});

app.get('/api/data', async (_req, res) => {
  try {
    const record = await StoreDataModel.findOne({ key: 'main_storefront_data' });
    res.json({ success: true, data: record ? record.data : null });
  } catch (err) { res.status(500).json({ success: false, error: err }); }
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
    res.json({ success: true, message: 'تم التحديث السحابي بنجاح', updatedAt: result.updatedAt });
  } catch (err) { res.status(500).json({ success: false, error: err }); }
});
// 🗑️ الرابط السحابي المسؤول عن تصفير عداد الزوار ومسح السجلات نهائياً
app.delete('/api/analytics', async (_req, res) => {
  try {
    await VisitorLogModel.deleteMany({});
    res.json({ success: true, message: 'تم تصفير عداد الزوار بنجاح ومسح كافة السجلات السحابية!' });
  } catch (err) { res.status(500).json({ success: false, error: err }); }
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

    const matchStage = JSON.parse('{"\$match":{"year":' + currentYear + ',"month":' + currentMonth + ',"day":' + currentDay + '}}');
    const groupStage = JSON.parse('{"\$group":{"_id":"\$hour","count":{"\$sum":1}}}');
    const sortStage = JSON.parse('{"\$sort":{"_id":1}}');

    const hourlyDistribution = await VisitorLogModel.aggregate([matchStage, groupStage, sortStage]);

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
  } catch (err) { res.status(500).json({ success: false, error: err }); }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.resolve(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`[TechsyZone] active on port ${PORT}`));
}
startServer();
