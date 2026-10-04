import React from 'react';
import { Settings, Shield, Heart } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface FooterProps {
  serverName: string;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ serverName, onOpenAdmin }) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0c0d11] py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span className="font-bold text-slate-300">{serverName}</span>
          <span aria-hidden="true">·</span>
          <span>جميع الحقوق محفوظة {new Date().getFullYear()}</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Settings className="h-3 w-3" />
            <span>لوحة تحكم المسؤول (تغيير الـ IP)</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
          هذا الموقع ليس منتجاً رسمياً من Mojang أو Microsoft وغير مرتبط بها. جميع حقوق ماين كرافت وشعاراتها مملوكة لشركة Mojang Studios.
        </p>
      </div>
    </footer>
  );
};
