import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Store, 
  Cpu, 
  Monitor, 
  HardDrive, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Calendar,
  Lock,
  DollarSign
} from 'lucide-react';

export const ProductDetailModal: React.FC<{ 
  product: Product | null; 
  onClose: () => void;
  onOpenOrderModal: (product: Product) => void;
}> = ({ product, onClose, onOpenOrderModal }) => {
  const { siteConfig, addToast, theme } = useApp();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const handleWhatsAppOrder = () => {
    const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
    const text = `مرحباً TechsyZone،
أرغب بطلب الجهاز التالي عبر وساطتكم المعتمدة:
• اسم الجهاز: ${product.name}
• السعر بالدولار: $${product.price}
• المتجر الشريك: ${product.storeName}
• المواصفات: ${product.specs.processor || ''} / ${product.specs.gpu || ''} / ${product.specs.ram || ''}
يرجى تأكيد موعد الفحص وتأمين الاستلام.`;
    
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleMessengerOrder = () => {
    window.open(siteConfig.messengerUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('info', 'تم النسخ', 'تم نسخ رابط الجهاز للمشاركة');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`flex items-center gap-2 text-xs font-mono font-bold ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <Store className="w-4 h-4" />
            <span>المتجر المعتمد: {product.storeName} ({product.storeLocation})</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Product Image */}
            <div className="md:col-span-5">
              <div className={`aspect-[4/3] rounded-2xl overflow-hidden border relative ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.badge && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 text-xs font-black shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Price Banner */}
              <div className={`mt-4 p-4 rounded-2xl border space-y-1 text-center ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs block font-bold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>السعر الرسمي بالدولار ($)</span>
                <div className={`text-3xl font-black font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>$</span>
                  {product.price.toLocaleString()}
                </div>
                <div className={`text-[11px] font-bold pt-1 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  ✓ لا توجد أي عمولة مضافة على المشتري
                </div>
              </div>
            </div>

            {/* Right: Specs & Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className={`text-xl font-black leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {product.name}
                </h3>
                <p className={`text-xs mt-2 leading-relaxed font-medium ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className={`rounded-2xl border p-3.5 space-y-2.5 text-xs ${
                theme === 'dark' 
                  ? 'border-slate-800 bg-slate-950/70' 
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <h4 className={`font-black border-b pb-1.5 flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-cyan-300 border-slate-800' : 'text-cyan-800 border-slate-200'
                }`}>
                  <Cpu className="w-3.5 h-3.5" />
                  <span>المواصفات الفنية التفصيلية:</span>
                </h4>

                {product.specs.processor && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>المعالج (CPU):</span>
                    <span className={`text-left font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{product.specs.processor}</span>
                  </div>
                )}
                {product.specs.gpu && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>كرت الشاشة (GPU):</span>
                    <span className={`text-left font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{product.specs.gpu}</span>
                  </div>
                )}
                {product.specs.ram && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>الذاكرة العشوائية (RAM):</span>
                    <span className={`text-left font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{product.specs.ram}</span>
                  </div>
                )}
                {product.specs.storage && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>التخزين (SSD/HDD):</span>
                    <span className={`text-left font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{product.specs.storage}</span>
                  </div>
                )}
                {product.specs.display && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>الشاشة والعرض:</span>
                    <span className={`text-left font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{product.specs.display}</span>
                  </div>
                )}
                {product.specs.condition && (
                  <div className={`flex justify-between py-1 border-b font-medium ${
                    theme === 'dark' ? 'border-slate-900 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>حالة الجهاز:</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>{product.specs.condition}</span>
                  </div>
                )}
                {product.specs.warranty && (
                  <div className="flex justify-between py-1 font-medium">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>الضمان والكفالة:</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'}`}>{product.specs.warranty}</span>
                  </div>
                )}
              </div>

              {/* Zero Extra Commission Guarantee Card */}
              <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                theme === 'dark'
                  ? 'bg-cyan-950/30 border-cyan-800/40 text-slate-300'
                  : 'bg-cyan-50 border-cyan-200 text-slate-800'
              }`}>
                <div className={`flex items-center gap-1.5 font-bold ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>توضيح وساطة TechsyZone الرسمية:</span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium">
                  سعر الجهاز المعروض هنا هو نفسه في المتجر الشريك (${product.price}). نحن نضمن لك فحص الجهاز ومطابقته ومساعدتك في تأمين الاستلام، وعمولتنا مخصومة من المتجر وليس منك.
                </p>
              </div>

            </div>

          </div>

          {/* Action Row */}
          <div className={`pt-4 border-t space-y-3 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* WhatsApp direct order */}
              <button
                onClick={handleWhatsAppOrder}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>طلب وتنسيق الشراء عبر واتساب</span>
              </button>

              {/* Messenger direct order */}
              <button
                onClick={handleMessengerOrder}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-900/80 hover:bg-blue-800 text-blue-100 border-blue-700'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.12 7.15.16.15.26.36.26.58l.05 2.13c.02.69.7 1.13 1.29.83l2.38-1.22c.18-.09.38-.11.58-.07.75.17 1.54.26 2.32.26 5.64 0 10-4.13 10-9.66C22 6.13 17.64 2 12 2zm1.08 12.98l-2.58-2.75-5.03 2.76 5.53-5.87 2.65 2.75 4.96-2.76-5.53 5.87z"/>
                </svg>
                <span>طلب وتواصل عبر ماسنجر</span>
              </button>
            </div>

            {/* Additional Secondary Row: Record in purchase history + Copy link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrderModal(product);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                }`}
              >
                <span>تثبيت الجهاز في سجل مشترياتي للمتابعة والتأكيد</span>
              </button>

              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  theme === 'dark'
                    ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم نسخ الرابط' : 'مشاركة رابط الجهاز'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
