import React from 'react';
import { Cpu, Loader2 } from 'lucide-react';

export const ServerLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none">
      {/* Background cyber grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="tech-grid-bg absolute inset-0 opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Animated Cyber Spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-cyan-400/30 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* The Exact Arabic Text Required */}
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          يرجى الانتظار جاري التحميل...
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          جاري مزامنة بيانات المتجر والأجهزة مع السيرفر السحابي
        </p>

        {/* Progress line */}
        <div className="w-56 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-6 border border-slate-800">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 animate-[pulse_1s_infinite] w-full" />
        </div>
      </div>
    </div>
  );
};
