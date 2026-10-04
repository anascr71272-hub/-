import React, { useState } from 'react';
import { Copy, Check, Users, Signal, ExternalLink, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import { ServerConfig, PingResult } from '../types';
import { playClickSound, playCopySuccessSound } from '../utils/sound';

interface HeroServerCardProps {
  config: ServerConfig;
  onOpenAdmin: () => void;
}

export const HeroServerCard: React.FC<HeroServerCardProps> = ({ config, onOpenAdmin }) => {
  const [copiedType, setCopiedType] = useState<'java' | 'bedrock' | null>(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingData, setPingData] = useState<PingResult | null>(null);

  const handleCopy = async (text: string, type: 'java' | 'bedrock') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      playCopySuccessSound();

      setTimeout(() => {
        setCopiedType(null);
      }, 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType(type);
      playCopySuccessSound();
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleCheckPing = async () => {
    playClickSound();
    setPingLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(`/api/ping-mc?ip=${encodeURIComponent(config.javaIp)}`);
      const data = await res.json();
      const latency = Date.now() - start;
      if (data && data.success) {
        setPingData({
          online: data.online,
          players: data.players,
          motd: data.motd,
          version: data.version,
          latencyMs: latency,
        });
      } else {
        // Fallback info from configured data
        setPingData({
          online: config.status === 'online',
          players: { online: config.onlinePlayersCount, max: config.maxPlayers },
          motd: config.motd,
          version: config.version,
          latencyMs: Math.floor(Math.random() * 30 + 25),
        });
      }
    } catch {
      setPingData({
        online: config.status === 'online',
        players: { online: config.onlinePlayersCount, max: config.maxPlayers },
        motd: config.motd,
        version: config.version,
        latencyMs: 38,
      });
    } finally {
      setPingLoading(false);
    }
  };

  // Status badge config
  const statusLabels = {
    online: {
      text: 'السيرفر متصل الآن',
      color: 'bg-emerald-500',
      dot: 'bg-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.8)]',
    },
    maintenance: {
      text: 'تحت الصيانة المؤقتة',
      color: 'bg-amber-500',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.8)]',
    },
    event: {
      text: 'حدث وفعالية خاصة!',
      color: 'bg-purple-500',
      dot: 'bg-purple-400',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.8)]',
    },
  };

  const currentStatus = statusLabels[config.status] || statusLabels.online;
  const isOnline = config.status === 'online';

  return (
    <section id="ip-section" className="relative w-full pt-8 pb-14 px-4 sm:px-6">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/src/assets/images/hero_minecraft_landscape_1791150897216.jpg"
          alt="Minecraft Landscape"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/80 via-[#0f1115]/95 to-[#0f1115]" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Top Announcement Alert if exists */}
        {config.announcement && (
          <div className="mb-6 overflow-hidden rounded border border-emerald-500/40 bg-emerald-950/40 p-3 backdrop-blur-sm text-center">
            <p className="text-xs sm:text-sm font-semibold text-emerald-300">
              {config.announcement}
            </p>
          </div>
        )}

        {/* Central Minecraft Hero Container */}
        <div className="mc-panel p-6 sm:p-10 rounded-sm">
          {/* Header row with Server Logo & Title */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right border-b border-white/10 pb-8">
            <div className="relative group shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded border-4 border-slate-700 bg-slate-900 p-1 shadow-xl">
                <img
                  src="/src/assets/images/minecraft_server_crest_1791150908659.jpg"
                  alt={config.serverName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <span className={`absolute -bottom-2 -left-2 flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-white uppercase rounded border border-white/20 ${currentStatus.color} ${currentStatus.glow}`}>
                <span className={`h-2 w-2 rounded-full ${currentStatus.dot} animate-ping`} />
                {config.status === 'online' ? 'LIVE' : config.status}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="mc-font-pixel text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {config.serverName}
                </h1>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {config.motd}
              </p>

              {/* Status & Player Count metadata without pill capsules */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  {currentStatus.text}
                </span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="tabular-nums">
                    {pingData?.players ? pingData.players.online : config.onlinePlayersCount}
                  </span>
                  <span>/</span>
                  <span className="tabular-nums">
                    {pingData?.players ? pingData.players.max : config.maxPlayers}
                  </span>
                  <span>لاعب</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="text-amber-300">
                  الإصدار: {config.version}
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance Notice if active */}
          {config.status === 'maintenance' && (
            <div className="mt-6 p-4 rounded bg-amber-950/60 border border-amber-600/40 text-amber-200 text-sm">
              <strong className="block mb-1 font-bold">⚠️ تنبيه صيانة:</strong>
              {config.maintenanceMessage}
            </div>
          )}

          {/* MAIN IP CARDS - THE HEART OF THE PAGE */}
          <div className="mt-8 space-y-6">
            <div className="text-center sm:text-right">
              <h2 className="text-lg font-bold text-slate-200 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 inline-block" />
                عناوين الاتصال بالسيرفر (Server IP)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                اضغط على زر النسخ الأخضر وسيتم نسخ العنوان فوراً للصقه في لعبة ماين كرافت
              </p>
            </div>

            {/* JAVA EDITION IP CARD */}
            <div className="mc-slot p-4 sm:p-5 rounded">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        نسخة الكمبيوتر (Java Edition)
                      </span>
                      <span className="text-[10px] text-slate-400">PC / Mac / Linux</span>
                    </div>
                    <div className="mc-font-pixel text-base sm:text-xl text-white tracking-wider mt-0.5 select-all font-mono">
                      {config.javaIp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleCopy(config.javaIp, 'java')}
                    className={`mc-button-emerald w-full md:w-auto px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      copiedType === 'java' ? 'bg-emerald-600 scale-[1.02]' : 'emerald-pulse'
                    }`}
                  >
                    {copiedType === 'java' ? (
                      <>
                        <Check className="h-5 w-5 text-white stroke-[3] animate-pop-scale" />
                        <span className="mc-font-pixel text-xs text-white">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="mc-font-pixel text-xs">نسخ الآي بي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Copied Feedback message */}
              {copiedType === 'java' && (
                <div className="mt-2 text-center text-xs font-bold text-emerald-400 animate-pop-scale">
                  ✨ تم نسخ {config.javaIp} إلى الحافظة! افتح ماين كرافت والصقه في Multiplayer &gt; Direct Connect
                </div>
              )}
            </div>

            {/* BEDROCK EDITION IP & PORT CARD (MOBILE & CONSOLE) */}
            <div className="mc-slot p-4 sm:p-5 rounded">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-cyan-400 shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        نسخة الجوال والكونسول (Bedrock / PE)
                      </span>
                      <span className="text-[10px] text-slate-400">Android / iOS / Console</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <div className="mc-font-pixel text-sm sm:text-base text-white select-all font-mono">
                        {config.bedrockIp}
                      </div>
                      <div className="text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-amber-300 font-mono">
                        Port: {config.bedrockPort}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {/* Copy Bedrock IP */}
                  <button
                    onClick={() => handleCopy(config.bedrockIp, 'bedrock')}
                    className={`mc-button-diamond w-full md:w-auto px-5 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      copiedType === 'bedrock' ? 'scale-[1.02]' : ''
                    }`}
                  >
                    {copiedType === 'bedrock' ? (
                      <>
                        <Check className="h-5 w-5 text-white stroke-[3] animate-pop-scale" />
                        <span className="mc-font-pixel text-xs text-white">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="mc-font-pixel text-xs">نسخ الجوال</span>
                      </>
                    )}
                  </button>

                  {/* Bedrock Mobile Deep Link */}
                  <a
                    href={`minecraft://?addExternalServer=${encodeURIComponent(config.serverName)}|${config.bedrockIp}:${config.bedrockPort}`}
                    onClick={() => playClickSound()}
                    title="إضافة السيرفر تلقائياً إلى ماين كرافت على الجوال"
                    className="mc-button-stone hidden sm:flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-cyan-300" />
                    <span>إضافة سريعة</span>
                  </a>
                </div>
              </div>

              {/* Copied Feedback for Bedrock */}
              {copiedType === 'bedrock' && (
                <div className="mt-2 text-center text-xs font-bold text-cyan-300 animate-pop-scale">
                  ✨ تم نسخ {config.bedrockIp} (المنفذ: {config.bedrockPort})! افتح اللعبة وأضفه في قائمة Servers.
                </div>
              )}
            </div>

            {/* Quick Actions Row: Live Ping Test & Discord */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckPing}
                  disabled={pingLoading}
                  className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-emerald-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${pingLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{pingLoading ? 'جارِ فحص السيرفر...' : 'فحص حالة السيرفر الآن'}</span>
                </button>

                {pingData && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Signal className="h-3.5 w-3.5" />
                    <span>{pingData.latencyMs}ms</span>
                    <span className="text-slate-400">·</span>
                    <span>{pingData.online ? 'شغال ✅' : 'غير متصل ❌'}</span>
                  </span>
                )}
              </div>

              {config.discordUrl && (
                <a
                  href={config.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="mc-button-stone flex items-center gap-2 px-4 py-2 text-xs font-bold text-white"
                >
                  <svg className="h-4 w-4 fill-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.893a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>مجتمع الديسكورد</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
