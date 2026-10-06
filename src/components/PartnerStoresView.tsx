import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  CheckCircle2, 
  Scale, 
  Coins, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export const PartnerStoresView: React.FC = () => {
  const { stores, siteConfig, setActiveTab, theme } = useApp();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
          theme === 'dark'
            ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
            : 'bg-cyan-50 border-cyan-200 text-cyan-900'
        }`}>
          <Store className="w-4 h-4 text-cyan-500" />
          <span>شبكة المتاجر المعتمدة والوساطة الشفافة</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-950'
        }`}>
          المتاجر الشريكة ونظام وساطة TechsyZone
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          نحن نوفر لك وصولاً موثوقاً لأفضل متاجر الحواسيب واللابتوبات المرخصة، مع ضمان فحص القطع وتثبيت الأسعار الرسمية.
        </p>
      </div>

      {/* The Core Brokerage Contract & 0% Extra Commission Explanation */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
        theme === 'dark'
          ? 'bg-slate-900 border-cyan-500/30 text-white'
          : 'bg-white border-cyan-500/30 text-slate-900 shadow-md'
      }`}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-500 shrink-0">
            <Scale className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <h2 className={`text-xl sm:text-2xl font-black ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              كيف تعمل وساطة TechsyZone؟ ولماذا لا يدفع المشتري أي مليم إضافي؟
            </h2>
            <div className={`text-sm sm:text-base leading-relaxed space-y-3 font-normal ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <p className="whitespace-pre-line">
                {siteConfig.brokerageExplanation}
              </p>
              
              <div className={`p-4 rounded-xl border space-y-2 ${
                theme === 'dark'
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-950'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-base ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
                }`}>
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  <span>تعهد عدم فرض أي أعباء مالية على المشتري:</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {siteConfig.zeroCommissionStatement}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Trust */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className={`p-4 rounded-xl border space-y-1.5 ${
            theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              <Coins className="w-4 h-4 text-cyan-500" />
              <span>نفس سعر المتجر بالدولار ($)</span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              إذا ذهبت إلى المتجر بنفسك ستجد الجهاز بنفس السعر المعروض على منصتنا تماماً دون أي فرق.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1.5 ${
            theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              <FileCheck2 className="w-4 h-4 text-cyan-500" />
              <span>فحص فني وتأكيد الكفالة</span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              نتأكد من صحة المواصفات (المعالج، كرت الشاشة، البطارية) قبل إتمام التسليم لحمايتك من أي خطأ.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1.5 ${
            theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              <span>العمولة مخصومة من ربح المتجر</span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              المتجر الشريك هو من يدفع لـ TechsyZone عمولة تسويقية لترويج بضاعته، ولست أنت كعميل مشترٍ.
            </p>
          </div>
        </div>
      </div>

      {/* Accredited Partner Stores List */}
      <div className="space-y-6">
        <div className={`flex items-center justify-between pb-2 border-b ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>قائمة المتاجر المعتمدة والشريكة</h3>
            <p className={`text-xs font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>جميع هذه المتاجر تلتزم بأسعار موحدة وكفالات حقيقية ومصنعية.</p>
          </div>
          <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold ${
            theme === 'dark'
              ? 'text-cyan-400 bg-slate-900 border-slate-800'
              : 'text-cyan-800 bg-white border-slate-300 shadow-sm'
          }`}>
            {stores.length} متاجر موثوقة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div 
              key={store.id} 
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>{store.name}</h4>
                      {store.verified && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                          theme === 'dark'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-cyan-100 text-cyan-900 border-cyan-300'
                        }`}>
                          معتمد وموثق
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-medium ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{store.city} - {store.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{store.rating}</span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mt-3 font-medium ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {store.description}
                </p>
              </div>

              {/* Store Footer Metadata */}
              <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600 font-medium'
              }`}>
                <div className="flex items-center gap-2">
                  <span>الأجهزة المتاحة:</span>
                  <span className={`font-mono font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>{store.activeItemsCount}+ جهاز</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن الأجهزة المتوفرة لديكم عبر وساطة TechsyZone')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    title="مراسلة المتجر عبر واتساب"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`tel:${store.phone}`}
                    className={`p-2 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                    title="اتصال هاتفي بالمتجر"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">هل تمتلك متجراً للكمبيوترات وترغب بالانضمام لشبكة TechsyZone؟</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          نرحب دائماً بالمتاجر ذات السمعة الطيبة والكفالات الحقيقية لتوسيع قاعدة المستفيدين وتقديم أفضل خيارات الحواسيب للمشترين.
        </p>
        <button
          onClick={() => {
            const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('مرحباً TechsyZone، أرغب بتقديم طلب اعتماد لمتجري ضمن شبكة شركائكم المعتمدة.')}`, '_blank');
          }}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
        >
          تواصل معنا لاعتماد متجرك
        </button>
      </div>

    </div>
  );
};
