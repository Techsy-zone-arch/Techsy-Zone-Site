import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Edit3, 
  Save, 
  X, 
  Palette, 
  Type, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  MessageCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export const LiveVisualEditor: React.FC = () => {
  const { 
    siteConfig, 
    updateSiteConfig, 
    isLiveEditorActive, 
    setIsLiveEditorActive, 
    triggerServerSync,
    theme,
    toggleTheme,
    addToast 
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'contact'>('content');

  // Local editor values
  const [brandName, setBrandName] = useState(siteConfig.brandName);
  const [heroTitle, setHeroTitle] = useState(siteConfig.heroMainTitle || 'TechsyZone');
  const [heroSubtitle, setHeroSubtitle] = useState(siteConfig.heroMainSubtitle || 'وساطتك الآمنة لأقوى الحواسيب واللابتوبات');
  const [heroDesc, setHeroDesc] = useState(siteConfig.heroMainDescription || '');
  const [announcementText, setAnnouncementText] = useState(siteConfig.announcementText);
  const [whatsAppNum, setWhatsAppNum] = useState(siteConfig.whatsAppNumber);
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primaryColor);

  if (!isLiveEditorActive) return null;

  const handleApplyChanges = () => {
    updateSiteConfig({
      brandName,
      heroMainTitle: heroTitle,
      heroMainSubtitle: heroSubtitle,
      heroMainDescription: heroDesc,
      announcementText,
      whatsAppNumber: whatsAppNum,
      primaryColor: primaryColor as any
    });
    triggerServerSync();
    addToast('success', 'تم حفظ التعديلات الحية', 'تم تطبيق التعديلات فوراً على الواجهة وحفظها بالسيرفر');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 transition-all duration-300">
      <div className="rounded-2xl bg-slate-900/95 border border-cyan-400/50 shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden">
        
        {/* Editor Floating Bar Header */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1.5 font-mono">
              <Edit3 className="w-3.5 h-3.5" />
              <span>محرر الواجهة الحي المباشر (WYSIWYG)</span>
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              {isOpen ? 'تصغير' : 'توسيع'}
            </button>
            <button
              onClick={() => setIsLiveEditorActive(false)}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              title="إغلاق وضع التعديل الحي"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {isOpen && (
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            
            {/* Editor Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-1.5 rounded-lg font-bold text-center transition-colors ${
                  activeTab === 'content' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                النصوص
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`py-1.5 rounded-lg font-bold text-center transition-colors ${
                  activeTab === 'theme' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                الألوان والخط
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-1.5 rounded-lg font-bold text-center transition-colors ${
                  activeTab === 'contact' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                الواتساب
              </button>
            </div>

            {/* TAB 1: Live Content */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">اسم الموقع في الترويسة:</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">العنوان الرئيسي للهيرو (Hero Title):</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">العنوان الفرعي:</label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">نص الوصف الترحيبي:</label>
                  <textarea
                    rows={2}
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">نص الشريط العلوي للإعلان:</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Live Colors & Fonts */}
            {activeTab === 'theme' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">النمط اللوني الرئيسي:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['cyan', 'emerald', 'blue', 'purple', 'amber'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPrimaryColor(c as any)}
                        className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] border capitalize ${
                          primaryColor === c
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">الخط العربي:</label>
                  <select
                    value={siteConfig.fontFamily}
                    onChange={(e) => {
                      const f = e.target.value as any;
                      updateSiteConfig({ fontFamily: f });
                      document.documentElement.style.setProperty('--font-primary', `'${f}', system-ui, sans-serif`);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Cairo">Cairo (كايرو تقني)</option>
                    <option value="Tajawal">Tajawal (تجوال متوازن)</option>
                    <option value="Alexandria">Alexandria (الإسكندرية مستقبلي)</option>
                    <option value="IBM Plex Sans Arabic">IBM Plex Sans (رسمي وجاد)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full py-2 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>تبديل الوضع الحالي ({theme === 'dark' ? 'ليلي' : 'نهاري'})</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Contact & Order WhatsApp */}
            {activeTab === 'contact' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">رقم الواتساب لاستقبال الطلبات:</label>
                  <input
                    type="text"
                    value={whatsAppNum}
                    onChange={(e) => setWhatsAppNum(e.target.value)}
                    placeholder="+963988112233"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-left"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    يتلقى هذا الرقم رسائل الطلبات ورسائل إلغاء الطلبات التلقائية من الزبائن.
                  </p>
                </div>
              </div>
            )}

            {/* Actions: Save Live Changes */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleApplyChanges}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات أونلاين</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
