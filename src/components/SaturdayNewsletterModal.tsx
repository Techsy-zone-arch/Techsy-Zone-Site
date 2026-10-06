import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  Lock
} from 'lucide-react';

export const SaturdayNewsletterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { subscribeToWeeklyDigest, siteConfig, theme } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    const ok = subscribeToWeeklyDigest(email, name);
    if (ok) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-slate-900 border-emerald-500/40 text-white'
          : 'bg-white border-emerald-500/40 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>نظام النشرات الأسبوعية ليوم السبت</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              نشرة الأسعار التلقائية كل سبت
            </h3>
            <p className={`text-xs leading-relaxed font-medium ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              اربط حسابك لتصلك رسالة إلكترونية أسبوعية كل يوم سبت بأحدث نشرات الأسعار واللابتوبات والكمبيوترات المتوفرة التي نحدثها مباشرة من المتاجر المعتمدة.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">تم تفعيل الاشتراك وتشفير حسابك بنجاح!</h4>
              <p className="text-xs text-emerald-200">
                ستصلك نشرة السبت القادمة بأحدث قوائم الأجهزة والأسعار بدون أي عمولة إضافية.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-bold mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>اسم المشترك</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الكامل أو اللقب"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>البريد الإلكتروني للربط</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Encryption guarantee badge */}
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-medium ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>بيانات بريدك مشفرة تماماً ومحمية من أي وصول خارجي.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>تأكيد الربط وتفعيل نشرة السبت</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
