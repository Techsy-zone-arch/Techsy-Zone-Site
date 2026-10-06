import React from 'react';
import { useApp } from '../context/AppContext';
import heroWorkstationImg from '../assets/images/hero_tech_workstation_1791263330543.jpg';
import { 
  ShieldCheck, 
  Search, 
  MessageCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Cpu, 
  Award,
  Zap,
  DollarSign
} from 'lucide-react';

export const HeroSection: React.FC<{ 
  onExploreCatalog: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}> = ({ onExploreCatalog, searchQuery, setSearchQuery }) => {
  const { siteConfig, setActiveTab, customElements, theme } = useApp();

  const handleWhatsAppContact = () => {
    const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent('مرحباً TechsyZone، أود الاستفسار عن الأجهزة المتوفرة والطلب عبر وساطتكم المعتمدة.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section className={`relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b ${
      theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
    }`}>
      {/* Background cyber lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`${theme === 'dark' ? 'tech-grid-bg opacity-30' : 'tech-grid-bg-light opacity-40'} absolute inset-0`} />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (RTL Right): Editorial & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Top Subtitle Trust Tag */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-900'
            }`}>
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span>منصة الوساطة التقنية الأولى للأجهزة الحقيقية</span>
            </div>

            {/* Giant Futuristic Headline (Customizable & Live Editable) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span className={`block font-mono ${
                theme === 'dark' 
                  ? 'text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]' 
                  : 'text-cyan-600'
              }`}>
                {siteConfig.heroMainTitle || siteConfig.brandName}
              </span>
              <span className={`block text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-950'
              }`}>
                {siteConfig.heroMainSubtitle || 'وساطتك الآمنة لأقوى الحواسيب واللابتوبات'}
              </span>
            </h1>

            {/* Serious, Trustworthy Brokerage Description */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-medium ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {siteConfig.heroMainDescription || 'نحن حلقة الوصل المباشرة بينك وبين نخبة المتاجر التقنية المعتمدة. نضمن لك اختيار أفضل جهاز لابتوب، حاسوب مكتبي، أو قطع هاردوير بمواصفات حقيقية وكفالة رسمية.'}
            </p>

            {/* The Critical Zero-Commission Trust Box */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-xl space-y-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-slate-900/95 to-slate-900/70 border-cyan-500/30'
                : 'bg-white border-cyan-300 shadow-cyan-900/5'
            }`}>
              <div className={`flex items-center gap-2 font-black text-sm sm:text-base ${
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
              }`}>
                <ShieldCheck className={`w-5 h-5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <span>ضمان شفافية السعر: 0% عمولة إضافية على المشتري!</span>
              </div>
              <p className={`text-xs sm:text-sm leading-normal font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                السعر المعروض في <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>TechsyZone</strong> هو نفس السعر الرسمي في المتجر بالدولار ($). عمولتنا مخصومة بالكامل من هامش ربح المتجر الشريك وليس فوق ثمن الجهاز.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن لابتوب (RTX 4080, Core i9, Legion, OLED) أو قطع تجميع..."
                  className={`w-full pl-12 pr-12 py-3.5 border rounded-xl text-sm shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                    theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-700/80 text-slate-100 placeholder-slate-400 focus:border-cyan-400'
                      : 'bg-white border-slate-300 text-slate-950 placeholder-slate-500 focus:border-cyan-600'
                  }`}
                />
                <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>تصفح الأجهزة والأسعار</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>طلب مباشر عبر الواتساب</span>
              </button>

              <button
                onClick={() => setActiveTab('stores')}
                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                }`}
              >
                <span>المتاجر الشريكة وشروط الوساطة</span>
              </button>
            </div>

            {/* Custom Builder Action Elements in Hero */}
            {customElements.filter(e => e.enabled && e.location === 'hero_announcement').map((elem) => (
              <div key={elem.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                theme === 'dark'
                  ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-200'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-950'
              }`}>
                <span className="font-bold">{elem.title}</span>
                <a
                  href={elem.actionTarget}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shrink-0"
                >
                  {elem.buttonText}
                </a>
              </div>
            ))}

            {/* Quick Proof Pillars */}
            <div className={`grid grid-cols-3 gap-3 pt-4 border-t text-center sm:text-right ${
              theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'
            }`}>
              <div>
                <span className={`text-xl sm:text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                }`}>100%</span>
                <p className={`text-xs mt-0.5 font-bold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
                }`}>أجهزة أصلية ومكفولة</p>
              </div>
              <div>
                <span className={`text-xl sm:text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                }`}>$0</span>
                <p className={`text-xs mt-0.5 font-bold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
                }`}>أي رسوم على المشتري</p>
              </div>
              <div>
                <span className={`text-xl sm:text-2xl font-black font-mono ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                }`}>24/7</span>
                <p className={`text-xs mt-0.5 font-bold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
                }`}>تواصل وطلب عبر واتساب</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Neon Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-75" />
              
              {/* Main Showcase Card */}
              <div className={`relative rounded-2xl overflow-hidden border shadow-2xl transition-all ${
                theme === 'dark' ? 'border-slate-700/80 bg-slate-900' : 'border-slate-300 bg-white'
              }`}>
                <div className={`aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
                }`}>
                  <img
                    src={heroWorkstationImg}
                    alt="TechsyZone Computer Workstation"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Card Floating Overlays */}
                <div className={`p-4 sm:p-5 border-t ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/40 border-slate-800/80 text-white' 
                    : 'bg-white border-slate-200 text-slate-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-mono uppercase tracking-wider block ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700 font-bold'
                      }`}>
                        محطة العمل والقيمنق الرسمية
                      </span>
                      <h3 className={`text-base font-extrabold mt-0.5 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>
                        فحص دقيق لكافة القطع قبل التسليم
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold font-mono ${
                      theme === 'dark'
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                        : 'bg-cyan-50 border-cyan-300 text-cyan-900'
                    }`}>
                      كفالة رسمية
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
