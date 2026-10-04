import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface NavbarProps {
  serverName: string;
  isDark: boolean;
  onToggleTheme: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverName,
  isDark,
  onToggleTheme,
  isSoundOn,
  onToggleSound,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#12141a]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={() => playClickSound()}
          className="mc-font-pixel flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span className="inline-block w-3.5 h-3.5 bg-emerald-500 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          <span className="truncate max-w-[200px] sm:max-w-xs">{serverName}</span>
        </a>

        {/* Zone 2: Clean 4-5 navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <a
            href="#ip-section"
            onClick={() => playClickSound()}
            className="hover:text-emerald-400 transition-colors"
          >
            الآي بي
          </a>
          <a
            href="#how-to-join"
            onClick={() => playClickSound()}
            className="hover:text-emerald-400 transition-colors"
          >
            طريقة الدخول
          </a>
          <a
            href="#features"
            onClick={() => playClickSound()}
            className="hover:text-emerald-400 transition-colors"
          >
            المميزات
          </a>
          <a
            href="#rules"
            onClick={() => playClickSound()}
            className="hover:text-emerald-400 transition-colors"
          >
            القوانين
          </a>
        </nav>

        {/* Zone 3: Primary interactive controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            title={isSoundOn ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
            className="flex h-9 w-9 items-center justify-center rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700 transition-colors"
          >
            {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-red-400" />}
          </button>

          {/* Theme Toggle (Overworld vs Nether/Night) */}
          <button
            onClick={() => {
              playClickSound();
              onToggleTheme();
            }}
            title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            className="flex h-9 w-9 items-center justify-center rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-amber-400 border border-slate-700 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-cyan-300" />}
          </button>

          {/* Admin Control Tool Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="mc-button-stone flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-emerald-300" />
            <span>لوحة التحكم</span>
          </button>
        </div>
      </div>
    </header>
  );
};
