import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useApp } from '../context/AppContext';

// داخل المكون الإداري:
const { isLiveEditorActive, setIsLiveEditorActive } = useApp();

<button 
  onClick={() => setIsLiveEditorActive(!isLiveEditorActive)}
  className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-bold text-xs"
>
  {isLiveEditorActive ? "إغلاق التخصيص الحركي" : "فتح تخصيص الأبعاد والمظهر الحركي 🎨"}
</button>
import { Product, PartnerStore, OrderItem, PaymentMethod, CustomBuilderElement } from '../types';
import { 
  Sliders, 
  Palette, 
  Share2, 
  Image as ImageIcon, 
  Upload, 
  Package, 
  Store, 
  FileText, 
  DollarSign, 
  Users, 
  Send, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Plus, 
  Lock, 
  LogOut, 
  Eye, 
  EyeOff,
  Sun,
  Moon,
  KeyRound,
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  Printer,
  Smartphone,
  MessageCircle,
  ExternalLink,
  Cloud,
  HardDrive,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    siteConfig,
    updateSiteConfig,
    resetSiteConfig,
    theme,
    toggleTheme,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    stores,
    addStore,
    updateStore,
    deleteStore,
    orders,
    confirmOrderAsAdmin,
    deleteOrder,
    setSelectedInvoiceOrder,
    subscribers,
    deleteSubscriber,
    sendSaturdayNewsletter,
    paymentMethods,
    updatePaymentMethods,
    customElements,
    addCustomElement,
    updateCustomElement,
    deleteCustomElement,
    cloudBackupInfo,
    syncGoogleDriveBackup,
    isLiveEditorActive,
    setIsLiveEditorActive,
    setIsAdminRoute,
    triggerServerSync,
    serverSyncStatus,
    isAdminLoggedIn,
    adminLogin,
    changeAdminPassword,
    adminLogout,
    addToast
  } = useApp();

  // Admin login PIN state
  const [pinInput, setPinInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Password change state
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState<
    'branding' | 'contacts' | 'products' | 'orders' | 'subscribers' | 'stores' | 'cms' | 'builder' | 'drive' | 'security'
  >('branding');

  // Form states for temporary edits
  const [configForm, setConfigForm] = useState(siteConfig);
  const [logoPreview, setLogoPreview] = useState(siteConfig.logoUrl);

  // New product form modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'laptops_gaming',
    price: 1500,
    originalStorePrice: 1500,
    storeId: stores[0]?.id || 'store_1',
    storeName: stores[0]?.name || 'سيريا تك سنتر',
    storeLocation: stores[0]?.city || 'دمشق',
    inStock: true,
    image: '/src/assets/images/laptop_flagship_pro_1791263342097.jpg',
    commissionAmount: 70,
    badge: '',
    description: '',
    specs: {
      processor: '',
      gpu: '',
      ram: '',
      storage: '',
      display: '',
      condition: 'جديد بالكرتون',
      warranty: 'ضمان سنة كاملة'
    }
  });

  // Partner store form modal state
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeForm, setStoreForm] = useState<Partial<PartnerStore>>({
    name: '',
    city: 'دمشق',
    address: '',
    phone: '',
    whatsapp: '',
    rating: 4.8,
    activeItemsCount: 20,
    description: '',
    verified: true,
    joinedYear: '2026'
  });

  // Saturday digest form state
  const [newsletterSubject, setNewsletterSubject] = useState(siteConfig.saturdayDigestSubject);
  const [newsletterBody, setNewsletterBody] = useState(siteConfig.saturdayDigestBody);

  // Custom element form
  const [newElemTitle, setNewElemTitle] = useState('');
  const [newElemDesc, setNewElemDesc] = useState('');
  const [newElemButton, setNewElemButton] = useState('');
  const [newElemTarget, setNewElemTarget] = useState('');

  // Handle password change form submission
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) {
      addToast('warning', 'حقل فارغ', 'يرجى إدخال كلمة المرور الجديدة');
      return;
    }
    if (newPasswordInput.length < 4) {
      addToast('warning', 'كلمة المرور قصيرة', 'كلمة المرور يجب ألا تقل عن 4 خانات');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      addToast('warning', 'عدم تطابق', 'كلمة المرور وتأكيدها غير متطابقين');
      return;
    }
    const res = changeAdminPassword(newPasswordInput.trim());
    if (res) {
      setPasswordChangeSuccess(true);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      triggerServerSync();
      setTimeout(() => setPasswordChangeSuccess(false), 5000);
    }
  };

  // Handle image upload for custom logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('warning', 'حجم الصورة كبير', 'يرجى اختيار صورة بحجم أقل من 2 ميغابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setConfigForm(prev => ({ ...prev, logoUrl: base64String, faviconUrl: base64String }));
        updateSiteConfig({ logoUrl: base64String, faviconUrl: base64String });
        addToast('success', 'تم حفظ الشعار الجديد', 'تم تحديث شعار المتجر بنجاح من جهازك');
      };
      reader.readAsDataURL(file);
    }
  };

  // If not logged in as Admin, show login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        {/* Day / Night mode toggle on top of login card */}
        <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
          <span className={`text-xs font-mono font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            بوابة الإدارة المستقلة (/administrationlink)
          </span>
          <button
            onClick={toggleTheme}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
            }`}
            title="تبديل الوضع النهاري / الليلي"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>
        </div>

        <div className={`w-full max-w-md p-8 rounded-3xl border transition-all space-y-6 text-center ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 shadow-2xl text-white' 
            : 'bg-white border-slate-200 shadow-xl text-slate-900'
        }`}>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${
            theme === 'dark'
              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}>
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              لوحة تحكم مدير TechsyZone
            </h2>
            <p className={`text-xs font-medium leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              الرجاء إدخال الرمز السري المعتمد للوصول إلى أدوات الإدارة وتخصيص المنصة والفواتير
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminLogin(pinInput);
            }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                name="admin_secret_auth"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل كلمة المرور الخاصة بالإدارة"
                className={`w-full px-10 py-3.5 rounded-xl text-center text-sm font-mono tracking-widest border transition-all focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              تسجيل دخول المدير
            </button>
          </form>

          <div className={`pt-3 border-t text-right space-y-1.5 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>نظام حماية مشفر، كلمة المرور قابلة للتغيير من الإعدادات.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Tabs
  const adminTabs = [
    { id: 'branding', label: 'المظهر والشعار والألوان', icon: Palette },
    { id: 'contacts', label: 'الروابط والواتساب والمسنجر', icon: Share2 },
    { id: 'products', label: 'إدارة الأجهزة والأسعار', icon: Package },
    { id: 'orders', label: 'الطلبات والفواتير والعمولات', icon: DollarSign },
    { id: 'subscribers', label: 'المشتركون ونشرة السبت', icon: Users },
    { id: 'drive', label: 'النسخ السحابي (Google Drive)', icon: Cloud },
    { id: 'stores', label: 'المتاجر الشريكة', icon: Store },
    { id: 'cms', label: 'الخصوصية وسياسة الوساطة', icon: FileText },
    { id: 'builder', label: 'باني الأقسام والعناصر', icon: Plus },
    { id: 'security', label: 'الأمان وكلمة المرور', icon: ShieldCheck },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono mb-1 font-bold">
            <Sliders className="w-4 h-4" />
            <span>لوحة التحكم الرئيسية والتخصيص الشامل (الرابط المستقل: /administrationlink)</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            إدارة متجر ووساطة TechsyZone
          </h1>
          <p className={`text-xs mt-0.5 font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            تحكم كامل في هوية الموقع، الألوان، أرقام التواصل، الفواتير، ونشرات البريد.
          </p>
        </div>

        {/* Global Admin Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day / Night Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
            }`}
            title="تبديل الوضع النهاري / الليلي"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>

          {/* Live Visual Editor Toggle */}
          <button
            onClick={() => {
              setIsLiveEditorActive(!isLiveEditorActive);
              if (!isLiveEditorActive) {
                setIsAdminRoute(false); // go to storefront to edit visually
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
              isLiveEditorActive
                ? 'bg-amber-500 text-slate-950 border border-amber-400 animate-pulse'
                : theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200'
            }`}
            title="تفعيل محرر الواجهة الحي للتعديل المباشر على المتجر"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isLiveEditorActive ? 'وضع التحرير الحي (مفعل)' : 'تفعيل التحرير الحي'}</span>
          </button>

          {/* Go to storefront */}
          <button
            onClick={() => setIsAdminRoute(false)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-500" />
            <span>معاينة المتجر الأساسي</span>
          </button>

          {/* Manual Save to Server */}
          <button
            onClick={() => {
              triggerServerSync();
              addToast('success', 'تم الحفظ أونلاين', 'تمت مزامنة كافة بيانات المتجر بنجاح مع السيرفر');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                : 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100'
            }`}
            title="مزامنة فورية مع السيرفر السحابي"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{serverSyncStatus === 'syncing' ? 'جاري المزامنة...' : 'حفظ بالسيرفر'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={adminLogout}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900'
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>قفل اللوحة</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : theme === 'dark'
                    ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200 shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BRANDING & LOGO UPLOAD & THEME COLORS */}
      {activeAdminTab === 'branding' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">تخصيص الهوية البصرية، الشعار، والألوان</h2>
            <p className="text-xs text-slate-400">يمكنك رفع شعار خاص من حاسوبك، تغيير خط الموقع وألوانه وزمن شاشة البداية.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Custom Logo Upload Section */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>شعار وأيقونة الموقع (رفع من الجهاز)</span>
              </h3>

              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-cyan-500/40 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all">
                    <Upload className="w-4 h-4" />
                    <span>رفع شعار جديد من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    يدعم ملفات PNG, JPG, WebP أو SVG. يظهر هذا الشعار في رأس الصفحة وشاشة الترحيب.
                  </p>
                  <button
                    onClick={() => {
                      const def = '/src/assets/images/techsyzone_logo_mark_1791263372552.jpg';
                      setLogoPreview(def);
                      updateSiteConfig({ logoUrl: def, faviconUrl: def });
                    }}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 hover:underline block"
                  >
                    استعادة الشعار الافتراضي المولد
                  </button>
                </div>
              </div>

              {/* Splash Screen Controls */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>تفعيل شاشة البداية المتحركة (Splash Screen) عند فتح الرابط:</span>
                  <input
                    type="checkbox"
                    checked={configForm.splashScreenEnabled}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setConfigForm(prev => ({ ...prev, splashScreenEnabled: val }));
                      updateSiteConfig({ splashScreenEnabled: val });
                    }}
                    className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>مدة ظهور الشعار وتلاشيه:</span>
                    <span className="font-mono text-cyan-400">{configForm.splashDurationSec || 2.2} ثانية</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={configForm.splashDurationSec || 2.2}
                    onChange={(e) => {
                      const sec = parseFloat(e.target.value);
                      setConfigForm(prev => ({ ...prev, splashDurationSec: sec }));
                      updateSiteConfig({ splashDurationSec: sec });
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Typography & Color Palette Customizer */}
            <div className="space-y-4 p-5 rounded-xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>الخطوط والسمات اللونية</span>
              </h3>

              {/* Font Family Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">نوع الخط العربي الرئيسي:</label>
                <select
                  value={configForm.fontFamily}
                  onChange={(e) => {
                    const font = e.target.value as any;
                    setConfigForm(prev => ({ ...prev, fontFamily: font }));
                    updateSiteConfig({ fontFamily: font });
                    document.documentElement.style.setProperty('--font-primary', `'${font}', system-ui, sans-serif`);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Cairo">خط كايرو (Cairo) - عصري وتقني</option>
                  <option value="Tajawal">خط تجوال (Tajawal) - هندسي متوازن</option>
                  <option value="Alexandria">خط الإسكندرية (Alexandria) - مستقبلي فائق الأناقة</option>
                  <option value="IBM Plex Sans Arabic">خط IBM بلكس (IBM Plex Sans Arabic) - تقني ورسمي</option>
                </select>
              </div>

              {/* Brand Title and Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">اسم المتجر والمنصة:</label>
                  <input
                    type="text"
                    value={configForm.brandName}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, brandName: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">الوصف الفرعي للمنصة:</label>
                  <input
                    type="text"
                    value={configForm.brandSubtitle}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, brandSubtitle: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">نص الشريط العلوي للإعلان وضمان السعر:</label>
                  <textarea
                    rows={2}
                    value={configForm.announcementText}
                    onChange={(e) => setConfigForm(prev => ({ ...prev, announcementText: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => updateSiteConfig(configForm)}
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
                >
                  حفظ تعديلات الهوية
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CONTACTS, WHATSAPP, MESSENGER, SOCIAL */}
      {activeAdminTab === 'contacts' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">إدارة الروابط، أرقام الواتساب، والمسنجر</h2>
            <p className="text-xs text-slate-400">
              تحكم برقم الواتساب ورابط المسنجر الذي يُحوّل إليه الزبائن فوراً عند الضغط على أزرار الطلب في المنتجات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WhatsApp Phone Number */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>رقم الواتساب المعتمد لتلقي الطلبات:</span>
              </div>
              <input
                type="text"
                value={configForm.whatsAppNumber}
                onChange={(e) => setConfigForm(prev => ({ ...prev, whatsAppNumber: e.target.value }))}
                placeholder="+963988112233"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                عند ضغط الزبون على «طلب عبر الواتساب»، سيفتح محادثة مباشرة مع هذا الرقم مرفقة بمواصفات وسعر الجهاز.
              </p>
              <a
                href={`https://wa.me/${configForm.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline pt-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>تجربة الرابط المباشر الآن</span>
              </a>
            </div>

            {/* Messenger URL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.12 7.15.16.15.26.36.26.58l.05 2.13c.02.69.7 1.13 1.29.83l2.38-1.22c.18-.09.38-.11.58-.07.75.17 1.54.26 2.32.26 5.64 0 10-4.13 10-9.66C22 6.13 17.64 2 12 2zm1.08 12.98l-2.58-2.75-5.03 2.76 5.53-5.87 2.65 2.75 4.96-2.76-5.53 5.87z"/>
                </svg>
                <span>رابط حساب الفيسبوك / المسنجر للطلب:</span>
              </div>
              <input
                type="text"
                value={configForm.messengerUrl}
                onChange={(e) => setConfigForm(prev => ({ ...prev, messengerUrl: e.target.value }))}
                placeholder="https://m.me/techsyzone.official"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                الرابط الذي يفتح صندوق المحادثة في تطبيق وموقع Messenger.
              </p>
            </div>

            {/* Facebook Page Button URL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <span>رابط «زوروا صفحتنا على الفيس بوك»:</span>
              </div>
              <input
                type="text"
                value={configForm.facebookPageUrl}
                onChange={(e) => setConfigForm(prev => ({ ...prev, facebookPageUrl: e.target.value }))}
                placeholder="https://facebook.com/techsyzone"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
              />
            </div>

            {/* Instagram Page Button URL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <span>رابط «زوروا حسابنا على انستغرام»:</span>
              </div>
              <input
                type="text"
                value={configForm.instagramPageUrl}
                onChange={(e) => setConfigForm(prev => ({ ...prev, instagramPageUrl: e.target.value }))}
                placeholder="https://instagram.com/techsyzone"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
              />
            </div>

            {/* Notification Email for Invoice alerts */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span>البريد الإلكتروني لإشعارات الفريق والفواتير (عند ضغط العميل تم الاستلام):</span>
              </div>
              <input
                type="email"
                value={configForm.adminNotificationEmail}
                onChange={(e) => setConfigForm(prev => ({ ...prev, adminNotificationEmail: e.target.value }))}
                placeholder="operations@techsyzone.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                هذا البريد هو الحساب الرسمي الذي تصل إليه إشعارات استلام الأجهزة لتحصيل عمولة الوساطة من المتجر الشريك.
              </p>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => updateSiteConfig(configForm)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
            >
              حفظ وتطبيق الروابط وأرقام التواصل
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {activeAdminTab === 'products' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">إدارة الأجهزة واللابتوبات والأسعار</h2>
              <p className="text-xs text-slate-400">إضافة وتعديل وحذف المنتجات وضبط عمولة المتجر المخصومة.</p>
            </div>
            <button
              onClick={() => {
                setEditingProductId(null);
                setProductForm({
                  name: '',
                  category: 'laptops_gaming',
                  price: 1800,
                  originalStorePrice: 1800,
                  storeId: stores[0]?.id || 'store_1',
                  storeName: stores[0]?.name || 'سيريا تك سنتر',
                  storeLocation: stores[0]?.city || 'دمشق',
                  inStock: true,
                  image: '/src/assets/images/laptop_flagship_pro_1791263342097.jpg',
                  commissionAmount: 80,
                  badge: '',
                  description: '',
                  specs: {
                    processor: 'Intel Core i7-14700HX',
                    gpu: 'NVIDIA RTX 4070 8GB',
                    ram: '16GB DDR5',
                    storage: '1TB NVMe SSD',
                    display: '16" QHD 165Hz',
                    condition: 'جديد بالكرتون',
                    warranty: 'كفالة سنة'
                  }
                });
                setShowProductModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة جهاز جديد</span>
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">الجهاز</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">المتجر الشريك</th>
                  <th className="p-3">السعر ($)</th>
                  <th className="p-3">العمولة من المتجر ($)</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover border border-slate-700 shrink-0" />
                      <span className="truncate max-w-xs">{p.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{p.category}</td>
                    <td className="p-3 text-slate-300">{p.storeName}</td>
                    <td className="p-3 font-mono font-bold text-cyan-300">${p.price.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-400">${p.commissionAmount.toLocaleString()}</td>
                    <td className="p-3 text-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setProductForm(p);
                          setShowProductModal(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS & INVOICES & COMMISSIONS */}
      {activeAdminTab === 'orders' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">إدارة الطلبات، تأكيد الاستلام، والفواتير</h2>
              <p className="text-xs text-slate-400">
                يمكن للمدير تأكيد شراء العميل في حال تواصله هاتفياً، واستعراض فاتورة الشراء المعتمدة بكامل تفاصيلها.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">إجمالي العمولات المستحقة:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${orders.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">رقم الطلب والتاريخ</th>
                  <th className="p-3">العميل ورقم الواتس</th>
                  <th className="p-3">اسم الجهاز</th>
                  <th className="p-3">السعر بالدولار ($)</th>
                  <th className="p-3">عمولة المتجر</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => {
                  const isConfirmed = ord.status === 'confirmed_by_admin';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono">
                        <span className="text-cyan-400 font-bold block">{ord.id}</span>
                        <span className="text-[11px] text-slate-400">{ord.orderDate} {ord.orderTime}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-white font-medium block">{ord.customerName}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{ord.customerPhone}</span>
                      </td>
                      <td className="p-3 text-slate-200">{ord.productName}</td>
                      <td className="p-3 font-mono font-bold text-white">${ord.productPrice.toLocaleString()}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">${ord.commissionAmount.toLocaleString()}</td>
                      <td className="p-3">
                        {isConfirmed ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            معتمد رسمياً
                          </span>
                        ) : ord.status === 'received_by_client' ? (
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                            استلمه العميل
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                            قيد التسليم
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-1">
                        {/* Confirm Purchase as Admin */}
                        {!isConfirmed && (
                          <button
                            onClick={() => confirmOrderAsAdmin(ord.id)}
                            className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] shadow"
                            title="تأكيد وصول الجهاز للعميل واعتماد الفاتورة"
                          >
                            تأكيد الشراء
                          </button>
                        )}

                        {/* View & Print Invoice */}
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-medium border border-slate-700"
                        >
                          عرض الفاتورة
                        </button>

                        {/* Delete Order */}
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الطلب #${ord.id} نهائياً؟`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          className="p-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
                          title="حذف الطلب نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIBERS & SATURDAY NEWSLETTER */}
      {activeAdminTab === 'subscribers' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">قائمة المشتركين ونظام نشرة السبت التلقائية</h2>
            <p className="text-xs text-slate-400">
              يتم تشفير وتأمين معلومات حسابات المشتركين تماماً، مع إرسال النشرة التلقائية يوم السبت من كل أسبوع بأحدث الأسعار.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Newsletter Dispatcher */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>إرسال نشرة السبت الأسبوعية للمشتركين</span>
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">عنوان النشرة:</label>
                <input
                  type="text"
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">محتوى النشرة وتحديثات الأسعار:</label>
                <textarea
                  rows={5}
                  value={newsletterBody}
                  onChange={(e) => setNewsletterBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 text-xs leading-relaxed"
                />
              </div>

              <div className="text-[11px] text-slate-400">
                آخر إرسال: {siteConfig.saturdayDigestLastRun || 'لم يُرسل هذا الأسبوع بعد'}
              </div>

              <button
                onClick={() => sendSaturdayNewsletter(newsletterSubject, newsletterBody)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال نشرة السبت الآن ({subscribers.length} مشترك)</span>
              </button>
            </div>

            {/* Encrypted Subscribers List */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  المشتركون المسجلون بالموقع (مع التشفير التام وزر الحذف):
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {subscribers.length} حساب مفعل
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">اسم المشترك</th>
                      <th className="p-3">البريد الإلكتروني المشفر</th>
                      <th className="p-3">تاريخ الانضمام</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/60">
                        <td className="p-3 font-semibold text-white">{sub.name}</td>
                        <td className="p-3 font-mono text-cyan-300">
                          {sub.maskedEmail || sub.email}
                        </td>
                        <td className="p-3 text-slate-400 font-mono">{sub.subscribedDate}</td>
                        <td className="p-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                            نشط (كل سبت)
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف المشترك ${sub.name}؟`)) {
                                deleteSubscriber(sub.id);
                              }
                            }}
                            className="p-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                            title="حذف المشترك"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: GOOGLE DRIVE CLOUD BACKUP & RESERVE STORAGE */}
      {activeAdminTab === 'drive' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <span>إعدادات النسخ الاحتياطي السحابي (Google Drive Cloud Reserve)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              يستعين المتجر بمساحة تخزين سحابية احتياطية على Google Drive لضمان عدم توقف السيرفر وحفظ كافة بيانات الأجهزة والمبيعات حتى في حال امتلاء مساحة الاستضافة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Google Drive Account Email Configuration */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>البريد الإلكتروني لحساب Google Drive المخزن عليه:</span>
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1">إيميل غوغل درايف المستهدف:</label>
                <input
                  type="email"
                  value={configForm.backupDriveEmail || ''}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, backupDriveEmail: e.target.value }))}
                  placeholder="yoashaheen@gmail.com أو backup@drive.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  يمكنك تعديل هذا الإيميل في أي وقت لحفظ النسخ السحابية التلقائية عليه.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => updateSiteConfig({ backupDriveEmail: configForm.backupDriveEmail })}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
                >
                  حفظ إيميل Drive
                </button>
                <button
                  onClick={() => syncGoogleDriveBackup(configForm.backupDriveEmail)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تصدير ومزامنة نسخة Drive الآن</span>
                </button>
              </div>
            </div>

            {/* Cloud Storage Status Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>حالة المخزن الاحتياطي السحابي:</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                  <span className="text-slate-400">حالة التخزين الاحتياطي:</span>
                  <span className="text-emerald-400 font-bold">جاهز ونشط (سعة غير محدودة)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                  <span className="text-slate-400">الإيميل المعتمد:</span>
                  <span className="text-white font-mono">{siteConfig.backupDriveEmail || 'yoashaheen@gmail.com'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                  <span className="text-slate-400">آخر مزامنة سحابية:</span>
                  <span className="text-cyan-300 font-mono">{cloudBackupInfo?.lastSync || 'جاهز للمزامنة الفورية'}</span>
                </div>
                {cloudBackupInfo?.fileName && (
                  <div className="flex justify-between py-1.5 text-slate-300">
                    <span className="text-slate-400">اسم ملف النسخة:</span>
                    <span className="text-slate-400 font-mono text-[11px] truncate max-w-[180px]">{cloudBackupInfo.fileName}</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-[11px] text-cyan-200">
                ✓ في حال نفاد المساحة من استضافة render، يتم توجيه النسخ والبيانات الاحتياطية تلقائياً نحو Google Drive دون أي توقف لمتجرك الإلكتروني.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: PARTNER STORES MANAGEMENT */}
      {activeAdminTab === 'stores' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">إدارة شبكة المتاجر الشريكة المعتمدة</h2>
              <p className="text-xs text-slate-400">إضافة وتعديل المتاجر التي نتعامل معها وربطها بنظام الوساطة.</p>
            </div>
            <button
              onClick={() => {
                setStoreForm({
                  name: '',
                  city: 'دمشق',
                  address: '',
                  phone: '',
                  whatsapp: '',
                  rating: 4.8,
                  activeItemsCount: 20,
                  description: '',
                  verified: true,
                  joinedYear: '2026'
                });
                setShowStoreModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة متجر شريك جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{s.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                      {s.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{s.address}</p>
                  <p className="text-[11px] text-slate-300 pt-1 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => deleteStore(s.id)}
                    className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                    title="حذف المتجر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CMS, POLICIES & PAYMENT METHODS */}
      {activeAdminTab === 'cms' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">إدارة المحتوى، سياسة الخصوصية، وسبل الدفع</h2>
            <p className="text-xs text-slate-400">عدّل بحريتك شروحات الخصوصية، عقد الوساطة بدون عمولة إضافية، وخيارات الدفع.</p>
          </div>

          <div className="space-y-6">
            {/* Privacy Policy Editor */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-cyan-300">محرر نص سياسة الخصوصية والشروط:</label>
              <textarea
                rows={5}
                value={configForm.privacyPolicy}
                onChange={(e) => setConfigForm(prev => ({ ...prev, privacyPolicy: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
              />
            </div>

            {/* Zero Commission Statement Editor */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-cyan-300">نص إيضاح أن العمولة مخصومة من المتجر و0% على المشتري:</label>
              <textarea
                rows={4}
                value={configForm.zeroCommissionStatement}
                onChange={(e) => setConfigForm(prev => ({ ...prev, zeroCommissionStatement: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Brokerage model explanation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-cyan-300">شرح طبيعة دور الوساطة بين المشتري والمتاجر:</label>
              <textarea
                rows={4}
                value={configForm.brokerageExplanation}
                onChange={(e) => setConfigForm(prev => ({ ...prev, brokerageExplanation: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => updateSiteConfig(configForm)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
              >
                حفظ تعديلات النصوص والسياسات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DYNAMIC CUSTOM BUILDER (Sections & Action Buttons) */}
      {activeAdminTab === 'builder' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">باني ومحرر الأقسام والعناصر التفاعلية المخصصة</h2>
            <p className="text-xs text-slate-400">
              إضافة أيقونات، بطاقات، لافتات ترويجية، وأزرار جديدة مع تحديد عملها (فتح رابط، تمرير، أو تنبيه) بكل مرونة.
            </p>
          </div>

          {/* Add New Custom Element */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-300">إضافة عنصر أو زر مخصص جديد:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">عنوان العنصر / القسم:</label>
                <input
                  type="text"
                  value={newElemTitle}
                  onChange={(e) => setNewElemTitle(e.target.value)}
                  placeholder="مثال: خدمة تركيب وتجهيز السوفتوير مجاناً"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">نص الزر التفاعلي:</label>
                <input
                  type="text"
                  value={newElemButton}
                  onChange={(e) => setNewElemButton(e.target.value)}
                  placeholder="مثال: طلب الخدمة الآن"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">وصف العنصر:</label>
                <input
                  type="text"
                  value={newElemDesc}
                  onChange={(e) => setNewElemDesc(e.target.value)}
                  placeholder="شرح بسيط ومباشر للعميل..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">رابط أو وجهة الزر (URL أو Target):</label>
                <input
                  type="text"
                  value={newElemTarget}
                  onChange={(e) => setNewElemTarget(e.target.value)}
                  placeholder="https://wa.me/... أو رابط صفحة"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!newElemTitle || !newElemButton) return;
                addCustomElement({
                  title: newElemTitle,
                  description: newElemDesc,
                  buttonText: newElemButton,
                  actionTarget: newElemTarget || '#',
                  actionType: 'external_url',
                  iconName: 'Sparkles',
                  location: 'hero_announcement',
                  enabled: true
                });
                setNewElemTitle('');
                setNewElemDesc('');
                setNewElemButton('');
                setNewElemTarget('');
              }}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              إضافة العنصر وتثبيته
            </button>
          </div>

          {/* List of active custom elements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400">العناصر المخصصة الحالية:</h4>
            {customElements.map((elem) => (
              <div key={elem.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white text-xs">{elem.title}</h5>
                  <p className="text-[11px] text-slate-400">{elem.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">{elem.buttonText}</span>
                  <button
                    onClick={() => deleteCustomElement(elem.id)}
                    className="p-1 rounded text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 10: SECURITY & ADMIN PASSWORD MANAGEMENT */}
      {activeAdminTab === 'security' && (
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-8 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className={`border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 mb-1 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>إدارة الحماية والصلاحيات المشفرة</span>
            </div>
            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              تغيير كلمة المرور وأمان لوحة الإدارة
            </h2>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
              تحكم كامل بكلمة المرور الخاصة بفتح رابط الإدارة المستقل (/administrationlink). تُحفظ التعديلات أونلاين فورياً على السيرفر.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Column */}
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`block font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>الحالة الحالية للأمان:</span>
                  <span className="text-[11px] text-emerald-500 font-bold">● الحماية مفعلة ومشفرة</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-[11px] text-slate-400 block font-sans">طول كلمة المرور الحالية</span>
                  <span className={`font-bold text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'}`}>
                    {(siteConfig.adminPassword || '262028Yosh@@').length} خانات
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  كلمة المرور الجديدة:
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة (4 خانات على الأقل)"
                    className={`w-full px-4 py-3 rounded-xl text-sm font-mono tracking-wider border focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg cursor-pointer ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title={showNewPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  تأكيد كلمة المرور الجديدة:
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور للتأكيد"
                  className={`w-full px-4 py-3 rounded-xl text-sm font-mono tracking-wider border focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
              </div>

              {passwordChangeSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>تم حفظ وتأكيد كلمة المرور الجديدة بنجاح وحفظها أونلاين بالسيرفر.</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>حفظ كلمة المرور الجديدة وتأمين الإدارة</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    changeAdminPassword('262028Yosh@@');
                    triggerServerSync();
                    addToast('info', 'إعادة ضبط الرمز', 'تمت إعادة ضبط كلمة المرور إلى الرمز الأساسي: 262028Yosh@@');
                  }}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                  title="استرجاع الرمز المؤقت 262028Yosh@@"
                >
                  إعادة ضبط إلى الرمز المؤقت (262028Yosh@@)
                </button>
              </div>
            </form>

            {/* Informational Guidelines Card */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>إرشادات أمان لوحة تحكم TechsyZone</span>
              </div>
              <ul className={`text-xs space-y-2.5 leading-relaxed font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">•</span>
                  <span>الرابط المستقل للإدارة هو <strong>/administrationlink</strong> ولا يظهر للمتسوقين في أي مكان بالمتجر الأساسي.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">•</span>
                  <span>كلمة المرور الحالية المعتمدة هي مؤقتاً: <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 font-mono font-bold">262028Yosh@@</code> (أو الكلمة التي تقوم بتعيينها وحفظها هنا).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">•</span>
                  <span>تم حجب الاقتراحات التلقائية للمتصفح لمنع تسريب كلمة المرور أو ظهورها في سجل الإكمال التلقائي.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">•</span>
                  <span>عند تعديل كلمة المرور يتم حفظها فوراً على السيرفر (data/db.json) وتبقى سارية حتى بعد تحديث الصفحة أو إعادة تشغيل الخادم.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">
              {editingProductId ? 'تعديل بيانات الجهاز' : 'إضافة جهاز جديد إلى TechsyZone'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم الجهاز / الموديل:</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Lenovo Legion Pro 7i..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">التصنيف:</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="laptops_gaming">لابتوبات قيمنق</option>
                  <option value="laptops_business">لابتوبات أعمال وألترا</option>
                  <option value="desktops_gaming">حواسيب تجميع قيمنق</option>
                  <option value="desktops_workstation">محطات عمل هندسية</option>
                  <option value="monitors">شاشات عرض احترافية</option>
                  <option value="hardware_gpu">كروت شاشة وهاردوير</option>
                  <option value="accessories">ملحقات واكسسوارات</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">السعر بالدولار ($):</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => {
                    const pr = Number(e.target.value) || 0;
                    setProductForm(prev => ({ ...prev, price: pr, originalStorePrice: pr }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">عمولة TechsyZone المخصومة من المتجر ($):</label>
                <input
                  type="number"
                  value={productForm.commissionAmount}
                  onChange={(e) => setProductForm(prev => ({ ...prev, commissionAmount: Number(e.target.value) || 0 }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">المتجر البائع:</label>
                <select
                  value={productForm.storeId}
                  onChange={(e) => {
                    const st = stores.find(s => s.id === e.target.value);
                    if (st) {
                      setProductForm(prev => ({
                        ...prev,
                        storeId: st.id,
                        storeName: st.name,
                        storeLocation: st.city
                      }));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">شارة مميزة (Badge):</label>
                <input
                  type="text"
                  value={productForm.badge || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="الأكثر طلباً / عرض حصري..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              {/* Specs */}
              <div>
                <label className="block text-slate-400 mb-1">المعالج (CPU):</label>
                <input
                  type="text"
                  value={productForm.specs?.processor || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, specs: { ...prev.specs, processor: e.target.value } }))}
                  placeholder="Core i9-14900HX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">كرت الشاشة (GPU):</label>
                <input
                  type="text"
                  value={productForm.specs?.gpu || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, specs: { ...prev.specs, gpu: e.target.value } }))}
                  placeholder="RTX 4080 12GB"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">الرام (RAM):</label>
                <input
                  type="text"
                  value={productForm.specs?.ram || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, specs: { ...prev.specs, ram: e.target.value } }))}
                  placeholder="32GB DDR5"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">التخزين (Storage):</label>
                <input
                  type="text"
                  value={productForm.specs?.storage || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, specs: { ...prev.specs, storage: e.target.value } }))}
                  placeholder="1TB NVMe Gen4"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingProductId) {
                    updateProduct(editingProductId, productForm);
                  } else {
                    addProduct(productForm as any);
                  }
                  setShowProductModal(false);
                }}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {editingProductId ? 'حفظ التعديلات' : 'نشر الجهاز في المتجر'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORE ADD MODAL */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">إضافة متجر شريك جديد</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم المتجر:</label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مركز التقنية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">المدينة:</label>
                <input
                  type="text"
                  value={storeForm.city}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="دمشق / حلب / اللاذقية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">العنوان التفصيلي:</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="شارع البحصة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">رقم الواتساب للمتجر:</label>
                <input
                  type="text"
                  value={storeForm.whatsapp}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="+963988112233"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStoreModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (storeForm.name) {
                    addStore(storeForm as any);
                    setShowStoreModal(false);
                  }
                }}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                اعتماد وإضافة المتجر
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
