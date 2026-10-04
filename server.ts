import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'server-config.json');

// Ensure data folder and config file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CONFIG = {
  serverName: "سيرفر الأبطال | HeroCraft",
  javaIp: "play.herocraft.net",
  bedrockIp: "bedrock.herocraft.net",
  bedrockPort: "19132",
  motd: "أفضل سيرفر سرفايفل وبلوكات وبيدوارز عربي! متوافق مع الجوال والكمبيوتر 🔥",
  version: "1.20 - 1.21.x",
  discordUrl: "https://discord.gg/minecraft",
  storeUrl: "",
  status: "online", // 'online' | 'maintenance' | 'event'
  maintenanceMessage: "السيرفر حالياً تحت الصيانة لتحديث العوالم وإضافة فعاليات جديدة.. سنعود قريباً!",
  onlinePlayersCount: 128,
  maxPlayers: 500,
  adminPin: "1234",
  announcement: "⚡ مرحباً بكم في سيرفرنا! انسخ الآي بي وادخل للعب فوراً، لا تنس الانضمام للديسكورد للجوائز الأسبوعية.",
  features: [
    { title: "سيرفر بدون لاج", desc: "استضافة قوية ومحمية من هجمات DDoS بنسبة 100%" },
    { title: "كروس بلاتفورم (Cross-Play)", desc: "العب مع أصدقائك من الجوال، الكمبيوتر، والكونسول معاً" },
    { title: "حماية كاملة للمباني", desc: "نظام أراضي ومطالبات يضمن سلامة أشيائك ومبانيك" },
    { title: "فعاليات وجوائز أسبوعية", desc: "مسابقات مستمرة وسحوبات على رتب VIP وهدايا قيمة" }
  ],
  rules: [
    "يمنع استخدام أي نوع من الهاكات أو البرامج المساعدة غير المصرح بها (X-Ray, KillAura, Fly).",
    "الاحترام المتبادل بين اللاعبين والإدارة وعدم السب أو الشتم بأي شكل.",
    "يمنع التخريب (Griefing) وسرقة ممتلكات اللاعبين في المناطق المحمية.",
    "يمنع نشر أو الإعلان عن سيرفرات أخرى داخل الشات."
  ]
};

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading server-config.json:', err);
  }
  return { ...DEFAULT_CONFIG };
}

function writeConfig(newConfig: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing server-config.json:', err);
    return false;
  }
}

// Ensure file exists with defaults initially
if (!fs.existsSync(CONFIG_FILE)) {
  writeConfig(DEFAULT_CONFIG);
}

// API: Get Server Info (safe, without leaking adminPin)
app.get('/api/server-config', (req: Request, res: Response) => {
  const config = readConfig();
  const { adminPin, ...safeConfig } = config;
  res.json({
    success: true,
    data: {
      ...safeConfig,
      hasAdminPin: Boolean(adminPin),
      // Tell client if it's default pin
      isDefaultPin: adminPin === '1234',
    }
  });
});

// API: Verify Admin PIN
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { pin } = req.body;
  const config = readConfig();
  if (pin && String(pin).trim() === String(config.adminPin).trim()) {
    res.json({ success: true, message: 'تم التحقق من الرمز بنجاح' });
  } else {
    res.status(401).json({ success: false, message: 'رمز الدخول غير صحيح' });
  }
});

// API: Update Server Info (Requires Admin PIN)
app.post('/api/server-config', (req: Request, res: Response) => {
  const { pin, updates } = req.body;
  const config = readConfig();

  if (!pin || String(pin).trim() !== String(config.adminPin).trim()) {
    return res.status(401).json({ success: false, message: 'رمز الدخول غير صحيح، لا يمكنك تعديل البيانات.' });
  }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'البيانات المرسلة غير صحيحة.' });
  }

  const updatedConfig = {
    ...config,
    ...updates,
  };

  // If owner requested to change admin PIN
  if (updates.newPin && typeof updates.newPin === 'string' && updates.newPin.trim().length >= 4) {
    updatedConfig.adminPin = updates.newPin.trim();
  }

  // Delete temp property
  delete (updatedConfig as any).newPin;

  const saved = writeConfig(updatedConfig);
  if (!saved) {
    return res.status(500).json({ success: false, message: 'فشل حفظ الإعدادات على الخادم.' });
  }

  const { adminPin, ...safeConfig } = updatedConfig;
  return res.json({
    success: true,
    message: 'تم حفظ إعدادات السيرفر وتحديث الآي بي بنجاح!',
    data: {
      ...safeConfig,
      hasAdminPin: Boolean(adminPin),
      isDefaultPin: adminPin === '1234',
    }
  });
});

// API: Minecraft Live Ping Proxy (mcsrvstat.us)
app.get('/api/ping-mc', async (req: Request, res: Response) => {
  const ip = req.query.ip as string;
  if (!ip) {
    return res.status(400).json({ success: false, message: 'IP مطلوب' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return res.json({
        success: true,
        online: Boolean(data.online),
        players: data.players || { online: 0, max: 0 },
        motd: data.motd?.clean?.join(' ') || '',
        version: data.version || '',
      });
    }
  } catch (err) {
    // If external service is blocked or down, fail gracefully
  }

  return res.json({
    success: false,
    online: false,
    message: 'تعذر الاتصال بخادم الفحص الخارجي',
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
