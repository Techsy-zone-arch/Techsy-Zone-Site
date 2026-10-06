import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  Store,
  DollarSign
} from 'lucide-react';

export const CustomerOrderModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ product, onClose, onSuccess }) => {
  const { createOrder, currentUser, theme } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(true);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) return;

    createOrder({
      customerName,
      customerPhone,
      customerEmail,
      product,
      notes
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-6 transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center gap-2 font-bold text-sm ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
          }`}>
            <ShoppingBag className="w-4 h-4" />
            <span>تسجيل وتثبيت الجهاز في سجل مشترياتك</span>
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {/* Product Summary Box */}
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-16 h-16 rounded-xl object-cover border shrink-0 ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-300'
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className={`text-xs font-bold truncate ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>{product.name}</h4>
              <p className={`text-[11px] mt-0.5 font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>{product.storeName} ({product.storeLocation})</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs font-mono font-black ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                }`}>${product.price.toLocaleString()}</span>
                <span className={`text-[10px] font-bold ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                }`}>0$ عمولة إضافية</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-bold mb-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
              }`}>الاسم الكامل للمشتري</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: م. عمر الحلبي"
                className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-bold mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>رقم الواتساب للتواصل</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+963988112233"
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>البريد الإلكتروني (مشفر)</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="omar@example.com"
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
              }`}>ملاحظات إضافية أو وقت الاستلام المفضل (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: أرغب باستلام الجهاز من فرع دمشق يوم الأربعاء بعد المعاينة..."
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Privacy & Saturday Newsletter Consent */}
            <label className={`flex items-start gap-2.5 p-3 rounded-xl border text-[11px] cursor-pointer select-none ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                className="accent-cyan-500 mt-0.5 rounded cursor-pointer"
              />
              <span className="leading-relaxed font-medium">
                موافقة على حفظ الجهاز في سجل مشترياتي الموثق، واستلام نشرة الأسعار الأسبوعية كل سبت مع الحفظ التام لخصوصية حسابي وتشفير بياناتي.
              </span>
            </label>
          </div>

          {/* Privacy Guarantee Note */}
          <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
            theme === 'dark' ? 'bg-cyan-950/20 border-cyan-800/30 text-cyan-200' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
          }`}>
            <Lock className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
            <span className="font-medium">
              بعد التثبيت، سيظهر هذا الجهاز في تبويب «سجل مشترياتي»، وعند وصوله إليك ستضغط على زر «تم الاستلام» لتأكيد الفاتورة.
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              تثبيت الجهاز في سجلي
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
