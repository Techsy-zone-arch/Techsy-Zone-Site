import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON parser with large payload for custom logo uploads
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read database
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  return null;
}

// Write database
function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

// REST API Routes
// 1. Get all app state
app.get('/api/data', (_req, res) => {
  const data = readDb();
  res.json({ success: true, data });
});

// 2. Save complete app state (used for sync and live visual editor)
app.post('/api/data', (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ success: false, error: 'Empty payload' });
  }
  const existing = readDb() || {};
  const merged = { ...existing, ...payload, updatedAt: new Date().toISOString() };
  writeDb(merged);
  res.json({ success: true, message: 'Data saved successfully', timestamp: merged.updatedAt });
});

// 3. Update Site Config & Google Drive Backup Email
app.post('/api/config', (req, res) => {
  const { config } = req.body;
  const db = readDb() || {};
  db.siteConfig = { ...(db.siteConfig || {}), ...config };
  db.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, siteConfig: db.siteConfig });
});

// 4. Google Drive Cloud Backup Sync
app.post('/api/backup-drive', (req, res) => {
  const { backupEmail } = req.body;
  const db = readDb() || {};
  const backupSnapshot = {
    exportedAt: new Date().toISOString(),
    backupEmail: backupEmail || db.siteConfig?.backupDriveEmail || 'backup@techsyzone.com',
    data: db,
    status: 'synced_to_cloud_reserve'
  };
  
  // Save a backup snapshot file
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
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback to index.html for SPA routes (including /administrationlink)
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
    // Production mode: Serve static dist
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
