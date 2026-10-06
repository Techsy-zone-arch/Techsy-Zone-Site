import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { siteConfig } = useApp();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!siteConfig.splashScreenEnabled) {
      onFinish();
      return;
    }

    const duration = (siteConfig.splashDurationSec || 2.2) * 1000;
    
    // Begin fade out 400ms before duration
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, Math.max(duration - 400, 1000));

    const finishTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [siteConfig.splashScreenEnabled, siteConfig.splashDurationSec, onFinish]);

  if (!siteConfig.splashScreenEnabled) return null;

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="tech-grid-bg absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Glowing Logo Container - Fully Proportional Across Any Screen Size */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 max-w-[40vw] max-h-[40vw] rounded-2xl overflow-hidden border border-cyan-400/40 bg-slate-900/90 shadow-2xl flex items-center justify-center p-2">
            <img
              src={siteConfig.logoUrl}
              alt={siteConfig.brandName}
              className="w-full h-full object-contain drop-shadow"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white mb-2 font-mono">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            {siteConfig.brandName}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 font-medium mb-6">
          {siteConfig.brandSubtitle}
        </p>

        {/* Tech indicator badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-cyan-300 mb-8">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>منظومة وساطة تقنية معتمدة · عمولة 0% على المشتري</span>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-[pulse_1.5s_infinite] w-full" />
        </div>
        <span className="text-[11px] text-slate-500 mt-3 font-mono">جاري تحميل المتجر... اضغط للتخطي</span>
      </div>
    </div>
  );
};
