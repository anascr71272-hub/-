import React, { useState } from 'react';
import { Laptop, Smartphone, Gamepad2, ChevronDown, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface HowToJoinProps {
  javaIp: string;
  bedrockIp: string;
  bedrockPort: string;
}

export const HowToJoin: React.FC<HowToJoinProps> = ({ javaIp, bedrockIp, bedrockPort }) => {
  const [activeTab, setActiveTab] = useState<'java' | 'bedrock' | 'console'>('java');

  return (
    <section id="how-to-join" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="mc-font-pixel text-xl sm:text-2xl font-bold text-white mb-2">
          كيف تدخل السيرفر؟
        </h2>
        <p className="text-sm text-slate-400">
          خطوات بسيطة وسريعة للانضمام والبدء في اللعب خلال ثوانٍ
        </p>
      </div>

      {/* Tabs / Filter Buttons */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('java');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer rounded transition-all ${
            activeTab === 'java'
              ? 'mc-button-emerald text-white'
              : 'mc-button-stone text-slate-300'
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span>الكمبيوتر (Java Edition)</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('bedrock');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer rounded transition-all ${
            activeTab === 'bedrock'
              ? 'mc-button-diamond text-white'
              : 'mc-button-stone text-slate-300'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>الجوال (Bedrock / PE)</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('console');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer rounded transition-all ${
            activeTab === 'console'
              ? 'mc-button-emerald text-white'
              : 'mc-button-stone text-slate-300'
          }`}
        >
          <Gamepad2 className="h-4 w-4" />
          <span>الكونسول (PS / Xbox / Switch)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mc-panel p-6 sm:p-8 rounded">
        {activeTab === 'java' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-400">
                  خطوات الدخول عبر كمبيوتر (Java Edition)
                </h3>
                <p className="text-xs text-slate-400">تدعم الإصدارات الأصلية والمكركة</p>
              </div>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded font-mono">
                Port: 25565 (تلقائي)
              </span>
            </div>

            <ol className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                  1
                </span>
                <div>
                  <strong>شغّل لعبة ماين كرافت:</strong> افتح اللانشر واختر أي إصدار مدعوم.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                  2
                </span>
                <div>
                  <strong>اختر قائمة اللعب الجماعي:</strong> اضغط على زر <span className="text-emerald-300 font-mono">Multiplayer</span> من الشاشة الرئيسية.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                  3
                </span>
                <div>
                  <strong>إضافة السيرفر:</strong> اضغط على <span className="text-emerald-300 font-mono">Add Server</span> (أو Direct Connect).
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                  4
                </span>
                <div>
                  <strong>لصق الآي بي:</strong> ضع في خانة Server Address هذا العنوان:
                  <div className="mc-slot p-2 mt-1 rounded font-mono text-emerald-400 text-sm inline-block select-all">
                    {javaIp}
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold">
                  5
                </span>
                <div>
                  <strong>ابدأ اللعب:</strong> اضغط على <span className="text-emerald-300 font-mono">Done</span> ثم انقر نقرتين على السيرفر للانضمام فوراً!
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'bedrock' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-cyan-400">
                  خطوات الدخول عبر الجوال (Android / iOS)
                </h3>
                <p className="text-xs text-slate-400">تطبيق Minecraft الرسمي على الهواتف والتابلت</p>
              </div>
              <span className="text-xs bg-slate-800 border border-slate-700 text-amber-300 px-2.5 py-1 rounded font-mono">
                Port: {bedrockPort}
              </span>
            </div>

            <ol className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 text-xs font-mono font-bold">
                  1
                </span>
                <div>
                  <strong>افتح ماين كرافت على جوالك:</strong> واضغط على زر <span className="text-cyan-300 font-mono">Play</span>.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 text-xs font-mono font-bold">
                  2
                </span>
                <div>
                  <strong>تبويب السيرفرات:</strong> انتقل إلى تبويب <span className="text-cyan-300 font-mono">Servers</span> في الأعلى ثم انزل لأسفل واضغط على <span className="text-cyan-300 font-mono">Add Server</span>.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 text-xs font-mono font-bold">
                  3
                </span>
                <div>
                  <strong>إدخال البيانات:</strong>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-300">
                    <li>• اسم السيرفر (Server Name): أي اسم تريده (مثلاً MyServer)</li>
                    <li>• عنوان السيرفر (Server Address): <span className="text-cyan-400 select-all">{bedrockIp}</span></li>
                    <li>• المنفذ (Port): <span className="text-amber-300 select-all">{bedrockPort}</span></li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-900/60 border border-cyan-500/50 text-cyan-400 text-xs font-mono font-bold">
                  4
                </span>
                <div>
                  <strong>حفظ وانضمام:</strong> اضغط على <span className="text-cyan-300 font-mono">Save</span> أو <span className="text-cyan-300 font-mono">Play</span> للدخول مباشرة لعالم اللعبة!
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-emerald-400">
                طريقة الدخول لأجهزة الكونسول (PlayStation, Xbox, Switch)
              </h3>
              <p className="text-xs text-slate-400">الاتصال عبر تطبيقات DNS أو برامج الربط الخارجية</p>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <p className="leading-relaxed">
                أجهزة الكونسول لا تتيح زر "Add Server" بشكل افتراضي بسبب قيود المنصة، ولكن يمكنك الدخول بسهولة عبر إحدى الطريقتين:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mc-slot p-4 rounded space-y-2">
                  <h4 className="font-bold text-amber-300 text-sm">الطريقة الأولى: تطبيق BedrockTogether</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    حمل تطبيق <strong>BedrockTogether</strong> المجاني على جوالك، واكتب فيه الآي بي والمنفذ واضغط Run. سيظهر السيرفر فوراً في قائمة Friends على الكونسول الخاص بك!
                  </p>
                </div>

                <div className="mc-slot p-4 rounded space-y-2">
                  <h4 className="font-bold text-amber-300 text-sm">الطريقة الثانية: تغيير الـ DNS</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    قم بتغيير إعدادات DNS في شبكة الكونسول إلى سيرفر Bedrock Connect (مثل: 104.238.130.180)، ثم ادخل أي سيرفر في القائمة وستفتح لك نافذة لإدخال آي بي سيرفرنا.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
