import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

interface RulesSectionProps {
  rules: string[];
}

export const RulesSection: React.FC<RulesSectionProps> = ({ rules }) => {
  return (
    <section id="rules" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mc-panel p-6 sm:p-8 rounded">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="h-10 w-10 flex items-center justify-center rounded bg-red-950/50 border border-red-500/40 text-red-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="mc-font-pixel text-lg sm:text-xl font-bold text-white">
              قوانين السيرفر
            </h2>
            <p className="text-xs text-slate-400">يرجى الالتزام بالقواعد لضمان بيئة لعب ممتعة للجميع وتجنب الحظر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="mc-slot p-3.5 rounded flex items-start gap-3 text-sm text-slate-200"
            >
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
