import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        const isSuccess = notif.type === 'success';
        const isWarning = notif.type === 'warning';

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-100'
                : isWarning
                  ? 'bg-slate-900/95 border-amber-500/40 text-amber-100'
                  : 'bg-slate-900/95 border-cyan-500/40 text-cyan-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 text-right text-xs">
              <h5 className="font-bold text-white text-xs leading-snug">{notif.title}</h5>
              <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">{notif.message}</p>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">{notif.timestamp}</span>
            </div>

            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
