import React from 'react';
import { Shield, Zap, Sparkles, Trophy, Globe, HeartHandshake } from 'lucide-react';
import { FeatureItem } from '../types';

interface ServerFeaturesProps {
  features: FeatureItem[];
}

export const ServerFeatures: React.FC<ServerFeaturesProps> = ({ features }) => {
  const iconList = [
    <Zap className="h-5 w-5 text-amber-400" />,
    <Globe className="h-5 w-5 text-cyan-400" />,
    <Shield className="h-5 w-5 text-emerald-400" />,
    <Trophy className="h-5 w-5 text-purple-400" />,
    <Sparkles className="h-5 w-5 text-pink-400" />,
    <HeartHandshake className="h-5 w-5 text-blue-400" />,
  ];

  return (
    <section id="features" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="mc-font-pixel text-xl sm:text-2xl font-bold text-white mb-2">
          لماذا تختار سيرفرنا؟
        </h2>
        <p className="text-sm text-slate-400">
          أفضل تجربة لعب ماين كرافت ممتعة وعادلة ومستقرة بدون أي تقطيع
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, index) => (
          <div
            key={index}
            className="mc-panel p-5 rounded hover:border-emerald-500/50 transition-colors"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-800/80 border border-slate-700 mb-3">
              {iconList[index % iconList.length]}
            </div>
            <h3 className="font-bold text-slate-100 text-base mb-1">
              {feat.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
