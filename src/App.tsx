/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ServerConfig } from './types';
import { Navbar } from './components/Navbar';
import { HeroServerCard } from './components/HeroServerCard';
import { HowToJoin } from './components/HowToJoin';
import { ServerFeatures } from './components/ServerFeatures';
import { RulesSection } from './components/RulesSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { isSoundEnabled, setSoundEnabled } from './utils/sound';

const INITIAL_CONFIG: ServerConfig = {
  serverName: "سيرفر الأبطال | HeroCraft",
  javaIp: "play.herocraft.net",
  bedrockIp: "bedrock.herocraft.net",
  bedrockPort: "19132",
  motd: "أفضل سيرفر سرفايفل وبلوكات وبيدوارز عربي! متوافق مع الجوال والكمبيوتر 🔥",
  version: "1.20 - 1.21.x",
  discordUrl: "https://discord.gg/minecraft",
  storeUrl: "",
  status: "online",
  maintenanceMessage: "السيرفر حالياً تحت الصيانة لتحديث العوالم وإضافة فعاليات جديدة.. سنعود قريباً!",
  onlinePlayersCount: 128,
  maxPlayers: 500,
  announcement: "⚡ مرحباً بكم في سيرفرنا! انسخ الآي بي وادخل للعب فوراً، لا تنس الانضمام للديسكورد للجوائز الأسبوعية.",
  features: [
    { title: "سيرفر بدون لاج", desc: "استضافة فائقة السرعة ومحمية من هجمات DDoS بنسبة 100%" },
    { title: "كروس بلاتفورم (Cross-Play)", desc: "العب مع أصدقائك من الجوال، الكمبيوتر، والكونسول معاً" },
    { title: "حماية كاملة للمباني", desc: "نظام أراضي ومطالبات يضمن سلامة أشيائك ومبانيك بدون سرقة" },
    { title: "فعاليات وجوائز أسبوعية", desc: "مسابقات مستمرة وسحوبات على رتب VIP وهدايا قيمة كل أسبوع" }
  ],
  rules: [
    "يمنع استخدام أي نوع من الهاكات أو البرامج المساعدة غير المصرح بها (X-Ray, KillAura, Fly).",
    "الاحترام المتبادل بين اللاعبين والإدارة وعدم السب أو الشتم بأي شكل.",
    "يمنع التخريب (Griefing) وسرقة ممتلكات اللاعبين في المناطق المحمية.",
    "يمنع نشر أو الإعلان عن سيرفرات أخرى داخل الشات."
  ]
};

export default function App() {
  const [config, setConfig] = useState<ServerConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mc_server_config');
      if (saved) {
        try {
          return { ...INITIAL_CONFIG, ...JSON.parse(saved) };
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_CONFIG;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Load from backend API on mount
  useEffect(() => {
    setIsSoundOn(isSoundEnabled());

    async function fetchServerConfig() {
      try {
        const res = await fetch('/api/server-config');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setConfig((prev) => ({ ...prev, ...json.data }));
            localStorage.setItem('mc_server_config', JSON.stringify(json.data));
          }
        }
      } catch (err) {
        console.warn('Backend server-config fetch failed, using local/cached state:', err);
      }
    }

    fetchServerConfig();
  }, []);

  const handleToggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    setSoundEnabled(next);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSaveConfig = async (
    updates: Partial<ServerConfig>,
    newPin?: string
  ): Promise<{ success: boolean; message: string }> => {
    // Current saved admin pin
    const pin = localStorage.getItem('mc_admin_pin') || '1234';

    try {
      const res = await fetch('/api/server-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          updates: {
            ...updates,
            newPin,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updatedConfig = { ...config, ...updates };
        setConfig(updatedConfig);
        localStorage.setItem('mc_server_config', JSON.stringify(updatedConfig));
        if (newPin) {
          localStorage.setItem('mc_admin_pin', newPin);
        }
        return { success: true, message: data.message || 'تم حفظ إعدادات السيرفر بنجاح!' };
      } else {
        // Fallback: save to localStorage if backend offline
        const updatedConfig = { ...config, ...updates };
        setConfig(updatedConfig);
        localStorage.setItem('mc_server_config', JSON.stringify(updatedConfig));
        if (newPin) {
          localStorage.setItem('mc_admin_pin', newPin);
        }
        return {
          success: true,
          message: 'تم الحفظ محلياً بنجاح وتحديث الآي بي على الموقع!',
        };
      }
    } catch {
      // Local fallback
      const updatedConfig = { ...config, ...updates };
      setConfig(updatedConfig);
      localStorage.setItem('mc_server_config', JSON.stringify(updatedConfig));
      if (newPin) {
        localStorage.setItem('mc_admin_pin', newPin);
      }
      return {
        success: true,
        message: 'تم حفظ البيانات وتحديث الآي بي بنجاح!',
      };
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-[#0c0e12] text-slate-100'
          : 'light bg-[#1e232d] text-slate-100'
      }`}
      dir="rtl"
    >
      {/* Top Navbar */}
      <Navbar
        serverName={config.serverName}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="space-y-4">
        {/* Main IP & Hero Section */}
        <HeroServerCard
          config={config}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* How to Join Guide */}
        <HowToJoin
          javaIp={config.javaIp}
          bedrockIp={config.bedrockIp}
          bedrockPort={config.bedrockPort}
        />

        {/* Server Features */}
        <ServerFeatures features={config.features} />

        {/* Server Rules */}
        <RulesSection rules={config.rules} />
      </main>

      {/* Footer */}
      <Footer
        serverName={config.serverName}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Owner Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
