import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  MessageCircle, 
  ExternalLink, 
  Laptop, 
  Store, 
  CreditCard, 
  FileText,
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteConfig, setActiveTab, theme } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t relative overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'border-slate-800 bg-slate-950 text-slate-300'
        : 'border-slate-200 bg-white text-slate-700'
    }`}>
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column (Col 5) */}
          <div className="lg:col-span-5 space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl overflow-hidden border p-1 flex items-center justify-center ${
                theme === 'dark' ? 'border-cyan-500/40 bg-slate-900' : 'border-cyan-300 bg-slate-50'
              }`}>
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.brandName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`text-2xl font-black font-mono tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                <span className="text-cyan-500">Techsy</span>Zone
              </span>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {siteConfig.brandSubtitle} - حلقة الوصل المباشرة مع المتاجر المعتمدة لضمان أفضل سعر حقيقي بالدولار وبدون أي عمولة إضافية فوق سعر الجهاز.
            </p>

            {/* Zero Commission Trust Badge */}
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 font-medium ${
              theme === 'dark' ? 'bg-slate-900 border-cyan-500/20 text-slate-300' : 'bg-slate-50 border-cyan-300 text-slate-800'
            }`}>
              <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                تعهد رسمي: العمولة مخصومة من أرباح المتجر الشريك وليس فوق ثمن الجهاز. لا توجد أي أعباء مالية مضافة على المشتري.
              </span>
            </div>

            {/* Social Links Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={siteConfig.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/70 border border-blue-800 text-xs text-blue-200 hover:bg-blue-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>زوروا صفحتنا على الفيس بوك</span>
              </a>

              <a
                href={siteConfig.instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-200 hover:bg-rose-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>انستغرام TechsyZone</span>
              </a>
            </div>
          </div>

          {/* Nav Links Column (Col 3) */}
          <div className="lg:col-span-3 space-y-3 text-right">
            <h4 className={`text-sm font-bold border-b pb-2 ${
              theme === 'dark' ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'
            }`}>أقسام المنصة</h4>
            <ul className={`space-y-2 text-xs font-medium ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <li>
                <button
                  onClick={() => { setActiveTab('home'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('products'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  كتالوج الحواسيب واللابتوبات
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('stores'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  المتاجر الشريكة وعقد الوساطة
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('payments'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  سبل وخيارات الدفع الآمن
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('privacy'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  سياسة الخصوصية وتشفير الحسابات
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('my-orders'); scrollToTop(); }}
                  className="hover:text-cyan-500 transition-colors text-cyan-600 font-bold cursor-pointer"
                >
                  سجل مشترياتي وتأكيد الاستلام
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Live Assistance (Col 4) */}
          <div className="lg:col-span-4 space-y-3 text-right">
            <h4 className={`text-sm font-bold border-b pb-2 ${
              theme === 'dark' ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'
            }`}>التواصل المباشر والاستفسارات</h4>
            
            <div className={`space-y-2 text-xs font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>واتساب المبيعات والطلبات: <strong className={`font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{siteConfig.whatsAppNumber}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>بريد العمليات والإشعارات: <strong className={`font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{siteConfig.adminNotificationEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-slate-400 shrink-0" />
                <span>تغطية المتاجر: دمشق، حلب، اللاذقية، حمص، وكافة المحافظات</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>بدء محادثة واتساب فورية</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600 font-medium'
        }`}>
          <div>
            © {new Date().getFullYear()} <strong className={`font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}`}>TechsyZone</strong>. كافة الحقوق محفوظة. منصة الوساطة التقنية المعتمدة.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-bold cursor-pointer"
            >
              <span>الرجوع للأعلى</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
