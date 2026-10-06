import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  Coins, 
  Wallet, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const PaymentMethodsView: React.FC = () => {
  const { paymentMethods, siteConfig, theme } = useApp();

  const getMethodIcon = (iconType: string) => {
    switch (iconType) {
      case 'cash':
        return <Banknote className="w-6 h-6 text-emerald-500" />;
      case 'bank':
        return <Building2 className="w-6 h-6 text-cyan-500" />;
      case 'crypto':
        return <Coins className="w-6 h-6 text-amber-500" />;
      case 'wallet':
        return <Wallet className="w-6 h-6 text-sky-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-cyan-500" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
          theme === 'dark'
            ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
            : 'bg-cyan-50 border-cyan-200 text-cyan-900'
        }`}>
          <CreditCard className="w-4 h-4 text-cyan-500" />
          <span>مرونة وسرعة في السداد</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-950'
        }`}>
          طرق وسبل الدفع المعتمدة
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          خيارات دفع آمنة ومتنوعة تناسب المشتري المحلي والمغترب مع ضمان المعاينة الكاملة قبل استلام الحاسوب.
        </p>
      </div>

      {/* Safety Notice */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-4 ${
        theme === 'dark'
          ? 'bg-cyan-950/40 border-cyan-500/30'
          : 'bg-cyan-50 border-cyan-200'
      }`}>
        <ShieldCheck className="w-6 h-6 text-cyan-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-900'}`}>
            قاعدة الأمان الذهبية لمشتري TechsyZone:
          </h4>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            عند اختيار الدفع نقداً عند الاستلام، لا تدفع أي ليرة أو دولار إلا بعد أن تفتح الجهاز بنفسك في المتجر أو مع مندوب التوصيل وتتأكد من مطابقة المعالج، كرت الشاشة، والرقم التسلسلي مع الكفالة الرسمية.
          </p>
        </div>
      </div>

      {/* Payment Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.filter(p => p.active).map((method) => (
          <div
            key={method.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  {getMethodIcon(method.iconType)}
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>{method.title}</h3>
                  <p className={`text-xs mt-0.5 font-medium ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>{method.shortDesc}</p>
                </div>
              </div>

              {/* Step/Detail bullets */}
              <ul className={`space-y-2 text-xs font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {method.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              <span className="font-semibold">العملة المقبولة:</span>
              <span className={`font-mono font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
              }`}>الدولار الأمريكي ($) أو المعادل بالعملة المحلية</span>
            </div>
          </div>
        ))}
      </div>

      {/* Support Action */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-1 text-center sm:text-right">
          <h4 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>هل لديك استفسار حول طريقة دفع محددة أو طلب تقسيط؟</h4>
          <p className={`text-xs font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>فريق الدعم الفني جاهز للإجابة وتسهيل التحويل المباشر مع المتجر.</p>
        </div>
        <button
          onClick={() => {
            const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('مرحباً TechsyZone، أود الاستفسار حول سبل الدفع وترتيب التحويل المالي لجهازي.')}`, '_blank');
          }}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-all cursor-pointer"
        >
          محادثة فريق الدفع عبر واتساب
        </button>
      </div>

    </div>
  );
};
