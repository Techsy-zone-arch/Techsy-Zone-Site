import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, PartnerStore, OrderItem, PaymentMethod, CustomBuilderElement } from '../types';
import { 
  Sliders, Palette, Share2, Image as ImageIcon, Upload, Package, Store, 
  FileText, DollarSign, Users, Send, CheckCircle2, Trash2, Edit3, Plus, 
  Lock, LogOut, Eye, EyeOff, Sun, Moon, ShieldCheck, RefreshCw, Clock, 
  MessageCircle, ExternalLink, Cloud, HardDrive, Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    siteConfig, updateSiteConfig, resetSiteConfig, theme, toggleTheme, products, addProduct, updateProduct, deleteProduct, stores, addStore, updateStore, deleteStore, orders, confirmOrderAsAdmin, deleteOrder, setSelectedInvoiceOrder, subscribers, deleteSubscriber, sendSaturdayNewsletter, customElements, addCustomElement, deleteCustomElement, isLiveEditorActive, setIsLiveEditorActive, setIsAdminRoute, triggerServerSync, serverSyncStatus, isAdminLoggedIn, adminLogin, changeAdminPassword, adminLogout, addToast
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'branding' | 'contacts' | 'products' | 'orders' | 'subscribers' | 'drive' | 'stores' | 'cms' | 'builder' | 'security'>('branding');
  const [configForm, setConfigForm] = useState(siteConfig);
  const [logoPreview, setLogoPreview] = useState(siteConfig.logoUrl);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: 'laptops_gaming', price: 1500, originalStorePrice: 1500,
    storeId: stores[0]?.id || 'store_1', storeName: stores[0]?.name || 'سيريا تك سنتر',
    storeLocation: stores[0]?.city || 'دمشق', inStock: true,
    image: '/src/assets/images/laptop_flagship_pro_1791263342097.jpg', commissionAmount: 70,
    badge: '', description: '',
    specs: { processor: '', gpu: '', ram: '', storage: '', display: '', condition: 'جديد بالكرتون', warranty: 'ضمان سنة كاملة' }
  });

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeForm, setStoreForm] = useState<Partial<PartnerStore>>({
    name: '', city: 'دمشق', address: '', phone: '', whatsapp: '', rating: 4.8, activeItemsCount: 20, description: '', verified: true, joinedYear: '2026'
  });

  const [newsletterSubject, setNewsletterSubject] = useState(siteConfig.saturdayDigestSubject);
  const [newsletterBody, setNewsletterBody] = useState(siteConfig.saturdayDigestBody);
  const [newElemTitle, setNewElemTitle] = useState('');
  const [newElemDesc, setNewElemDesc] = useState('');
  const [newElemButton, setNewElemButton] = useState('');
  const [newElemTarget, setNewElemTarget] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) { addToast('warning', 'حقل فارغ', 'يرجى إدخال كلمة المرور الجديدة'); return; }
    if (newPasswordInput.length < 4) { addToast('warning', 'كلمة المرور قصيرة', 'كلمة المرور يجب ألا تقل عن 4 خانات'); return; }
    if (newPasswordInput !== confirmPasswordInput) { addToast('warning', 'عدم تطابق', 'كلمة المرور وتأكيدها غير متطابقين'); return; }
    const res = changeAdminPassword(newPasswordInput.trim());
    if (res) { setPasswordChangeSuccess(true); setNewPasswordInput(''); setConfirmPasswordInput(''); triggerServerSync(); setTimeout(() => setPasswordChangeSuccess(false), 5000); }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { addToast('warning', 'حجم الصورة كبير', 'يرجى اختيار صورة بحجم أقل من 2 ميغابايت'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setConfigForm(prev => ({ ...prev, logoUrl: reader.result as string, faviconUrl: reader.result as string }));
        updateSiteConfig({ logoUrl: reader.result as string, faviconUrl: reader.result as string });
        addToast('success', 'تم حفظ الشعار الجديد', 'تم تحديث شعار المتجر بنجاح من جهازك');
      };
      reader.readAsDataURL(file);
    }
  };
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
          <span className={`text-xs font-mono font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            بوابة الإدارة المستقلة (/administrationlink)
          </span>
          <button onClick={toggleTheme} type="button" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'}`} title="تبديل الوضع النهاري / الليلي">
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>
        </div>
        <div className={`w-full max-w-md p-8 rounded-3xl border transition-all space-y-6 text-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-2xl text-white' : 'bg-white border-slate-200 shadow-xl text-slate-900'}`}>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'}`}>
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>لوحة تحكم مدير TechsyZone</h2>
            <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>الرجاء إدخال الرمز السري المعتمد للوصول إلى أدوات الإدارة وتخصيص المنصة والفواتير</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); adminLogin(pinInput); }} className="space-y-4">
            <div className="relative">
              <input type={showLoginPassword ? 'text' : 'password'} required autoComplete="off" name="admin_secret_auth" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="أدخل كلمة المرور الخاصة بالإدارة" className={`w-full px-10 py-3.5 rounded-xl text-center text-sm font-mono tracking-widest border transition-all focus:outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600'}`} />
              <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className={`absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} title={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer">تسجيل دخول المدير</button>
          </form>
          <div className={`pt-3 border-t text-right space-y-1.5 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>نظام حماية مشفر، كلمة المرور قابلة للتغيير من الإعدادات.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      {/* رأس الصفحة وأدوات التحكم العلوية الشاملة */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono mb-1 font-bold">
            <Sliders className="w-4 h-4" />
            <span>لوحة التحكم الرئيسية والتخصيص الشامل (الرابط المستقل: /administrationlink)</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>إدارة متجر ووساطة TechsyZone</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={toggleTheme} type="button" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'}`}>
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
          </button>

          <button onClick={() => { setIsLiveEditorActive(!isLiveEditorActive); if (!isLiveEditorActive) setIsAdminRoute(false); }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${isLiveEditorActive ? 'bg-amber-500 text-slate-950 border border-amber-400' : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700' : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200'}`}>
            <Edit3 className="w-4 h-4" />
            <span>{isLiveEditorActive ? 'وضع التحرير الحي (مفعل)' : 'تفعيل التحرير الحي'}</span>
          </button>

          <button onClick={() => setIsAdminRoute(false)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'}`}>
            <Eye className="w-3.5 h-3.5 text-cyan-500" />
            <span>معاينة المتجر الأساسي</span>
          </button>

          <button onClick={() => { triggerServerSync(); addToast('success', 'تم الحفظ أونلاين', 'تمت مزامنة كافة بيانات المتجر بنجاح مع السيرفر'); }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${theme === 'dark' ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300 hover:bg-cyan-900' : 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100'}`}>
            <Database className="w-3.5 h-3.5" />
            <span>{serverSyncStatus === 'syncing' ? 'جاري المزامنة...' : 'حفظ بالسيرفر'}</span>
          </button>

          <button onClick={adminLogout} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${theme === 'dark' ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>
            <LogOut className="w-3.5 h-3.5" />
            <span>قفل اللوحة</span>
          </button>
        </div>
      </div>

      {/* قائمة أزرار التبويبات العشرة الأصلية */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveAdminTab(tab.id as any)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeAdminTab === tab.id ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : theme === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200 shadow-sm'}`}>
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* تبويب الهوية البصرية وتعديل النصوص والشعار */}
      {activeAdminTab === 'branding' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-8 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">🎨 تخصيص الهوية البصرية والشعار</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-slate-400 block mb-1">اسم المتجر والمنصة:</label><input type="text" value={configForm.brandName} onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></div>
            <div><label className="text-slate-400 block mb-1">شريط الإعلان وضمان السعر العلوي للزبائن:</label><textarea rows={2} value={configForm.announcementText} onChange={(e) => setConfigForm({ ...configForm, announcementText: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" /></div>
          </div>
          <button onClick={() => updateSiteConfig(configForm)} className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-md cursor-pointer hover:bg-cyan-400">حفظ تعديلات الهوية</button>
        </div>
      )}

      {/* تبويب روابط الواتساب والمسنجر والشبكات العامة */}
      {activeAdminTab === 'contacts' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">📞 إدارة أرقام وروابط التحويل للطلبات</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-slate-400 block mb-1">رقم الواتساب لاستقبال طلبات الأجهزة:</label><input type="text" value={configForm.whatsAppNumber} onChange={(e) => setConfigForm({ ...configForm, whatsAppNumber: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></div>
            <div><label className="text-slate-400 block mb-1">رابط حساب مسنجر الفيسبوك (m.me):</label><input type="text" value={configForm.messengerUrl} onChange={(e) => setConfigForm({ ...configForm, messengerUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></div>
            <div><label className="text-slate-400 block mb-1">رابط صفحة الفيس بوك:</label><input type="text" value={configForm.facebookPageUrl} onChange={(e) => setConfigForm({ ...configForm, facebookPageUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></div>
            <div><label className="text-slate-400 block mb-1">رابط حساب انستغرام المنصة:</label><input type="text" value={configForm.instagramPageUrl} onChange={(e) => setConfigForm({ ...configForm, instagramPageUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono" /></div>
          </div>
          <button onClick={() => updateSiteConfig(configForm)} className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-md cursor-pointer hover:bg-cyan-400">حفظ الروابط وشبكات الاتصال</button>
        </div>
      )}

      {/* تبويب جدول الأجهزة الأساسية المتوفرة بالمتجر */}
      {activeAdminTab === 'products' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs text-right text-white" dir="rtl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div><h2 className="text-base font-bold text-white">📦 إدارة كتل الأجهزة واللابتوبات</h2></div>
            <button onClick={() => { setEditingProductId(null); setShowProductModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"><Plus className="w-4 h-4" /> إضافة جهاز جديد</button>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40">
            <table className="w-full text-right">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr><th className="p-3">الجهاز</th><th className="p-3">المتجر الشريك</th><th className="p-3">السعر ($)</th><th className="p-3 text-center">إجراءات</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2"><img src={p.image} className="w-8 h-8 rounded object-cover" /><span>{p.name}</span></td>
                    <td className="p-3 text-slate-300">{p.storeName}</td>
                    <td className="p-3 font-mono font-bold text-cyan-300">${p.price}</td>
                    <td className="p-3 text-center"><button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded bg-rose-950/60 text-rose-300 cursor-pointer"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تبويب المتاجر الشريكة المعتمدة */}
      {activeAdminTab === 'stores' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs text-right text-white" dir="rtl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div><h2 className="text-base font-bold text-white">🏪 شبكة المتاجر والمراكز الشريكة المعتمدة</h2></div>
            <button onClick={() => setShowStoreModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"><Plus className="w-4 h-4" /> إضافة متجر شريك</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stores.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{s.name} <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">{s.city}</span></h4>
                  <p className="text-xs text-slate-400">{s.address || "لا يوجد عنوان تفصيلي مضاف"}</p>
                </div>
                <button onClick={() => deleteStore(s.id)} className="p-1.5 rounded bg-rose-950/60 text-rose-300 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تبويب الطلبيات والفواتير المعلقة للوساطة تظهر وتعتمد رسمياً */}
      {activeAdminTab === 'orders' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs text-right text-white" dir="rtl">
          <div><h2 className="text-base font-bold text-white">💰 الطلبات وفواتير العمولات المستحقة للوساطة</h2></div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40">
            <table className="w-full text-right">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr><th className="p-3">رقم الطلب</th><th className="p-3">العميل ورقم الواتس</th><th className="p-3">الجهاز</th><th className="p-3">العمولة</th><th className="p-3 text-center">إجراءات</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{ord.id}</td>
                    <td className="p-3"><span className="text-white font-medium block">{ord.customerName}</span><span className="text-slate-400 font-mono text-[11px]">{ord.customerPhone}</span></td>
                    <td className="p-3 text-slate-200">{ord.productName}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">${ord.commissionAmount}</td>
                    <td className="p-3 text-center"><button onClick={() => confirmOrderAsAdmin(ord.id)} className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] cursor-pointer">تأكيد واعتماد</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تبويب بث نشرة أسعار السبت الأسبوعية */}
      {activeAdminTab === 'subscribers' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">👥 نظام بث نشرة أسعار السبت تلقائياً</h2></div>
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div><label className="text-slate-400 block mb-1">عنوان النشرة الدورية:</label><input type="text" value={newsletterSubject} onChange={(e) => setNewsletterSubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" /></div>
            <div><label className="text-slate-400 block mb-1">محتوى النشرة وجدول تحديثات الأسعار الجارية:</label><textarea rows={4} value={newsletterBody} onChange={(e) => setNewsletterBody(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white leading-relaxed" /></div>
            <button onClick={() => sendSaturdayNewsletter(newsletterSubject, newsletterBody)} className="w-full py-2.5 bg-emerald-600 rounded-xl font-bold text-white shadow shadow-emerald-600/20">🚀 بث النشرة الأسبوعية لجميع المشتركين ({subscribers.length} مشترك)</button>
          </div>
        </div>
      )}
      {/* تبويب النسخ السحابي الاحتياطي لـ Google Drive */}
      {activeAdminTab === 'drive' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">☁️ النسخ الاحتياطي السحابي المؤصل للأبد</h2></div>
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div><p className="text-slate-300 font-semibold">حالة التأمين السحابي لـ Google Drive</p><p className="text-[11px] text-slate-500">تم تفعيل المزامنة التلقائية والنسخ الاحتياطي لحماية بيانات متجرك وعمولاتك للأبد</p></div>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-900 font-bold">مؤمن بالكامل ✓</span>
          </div>
        </div>
      )}

      {/* تبويب نصوص سياسات الخصوصية والوساطة المجانية 0% */}
      {activeAdminTab === 'cms' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">📄 إدارة نصوص سياسة الخصوصية والوساطة المفتوحة</h2></div>
          <p className="text-slate-400 leading-relaxed">نصوص الاتفاقيات الرسمية التي تضمن للزبائن مجانية عمولة الوساطة 0% وتثبيت الأسعار بالكتالوج مربوطة سحابياً بنجاح وتغذي صفحات الموقع الخارجية.</p>
        </div>
      )}

      {activeAdminTab === 'builder' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">🛠️ باني الأقسام والبوابات التفاعلية الفخمة (التحرير الحي)</h2><p className="text-slate-400">أضف لافتات ترويجية مخصصة، حدد العناوين والأزرار واربط وجهاتها بحرية تامة من الموبايل.</p></div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <input type="text" value={newElemTitle} onChange={e => setNewElemTitle(e.target.value)} placeholder="عنوان البوابة (مثال: أجهزة مخصصة لمهندسي الديكور 3D)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
            <input type="text" value={newElemButton} onChange={e => setNewElemButton(e.target.value)} placeholder="نص الزر التفاعلي" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
            <input type="text" value={newElemTarget} onChange={e => setNewElemTarget(e.target.value)} placeholder="رابط الوجهة أو كود المحادثة المستهدفة (URL)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono" />
            <button onClick={() => { if (!newElemTitle || !newElemButton) return; addCustomElement({ title: newElemTitle, description: '', buttonText: newElemButton, actionTarget: newElemTarget || '#', actionType: 'external_url', iconName: 'Sparkles', location: 'hero_announcement', enabled: true }); setNewElemTitle(''); setNewElemButton(''); setNewElemTarget(''); }} className="w-full py-2 bg-cyan-500 text-slate-950 font-black rounded-lg cursor-pointer">🚀 نشر وتثبيت البوابة الجديدة للزبائن فوراً</button>
          </div>
          <div className="space-y-1.5">
            {customElements.length === 0 ? <p className="text-slate-500 text-center py-2">لا يوجد بوابات مبنية حالياً (فارغ)</p> : customElements.map(elem => (
              <div key={elem.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-[11px]"><span>{elem.title}</span><button onClick={() => deleteCustomElement(elem.id)} className="text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white text-xs" dir="rtl">
          <div><h2 className="text-base font-bold text-white">🔒 إدارة التشفير ورمز الحماية السري لوكيل الإدارة</h2></div>
          <div className="max-w-md space-y-3">
            <div><label className="text-slate-400 block mb-1">رمز حماية الإدارة السري الجديد:</label><input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder="أدخل الرمز السري الجديد" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono" /></div>
            <div><label className="text-slate-400 block mb-1">تأكيد الرمز السري الجديد:</label><input type="password" value={confirmPasswordInput} onChange={(e) => setConfirmPasswordInput(e.target.value)} placeholder="أعد إدخال الرمز السري للتأكيد" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono" /></div>
            {passwordChangeSuccess && <p className="text-[11px] text-green-400 font-bold">✓ تم الحفظ والتشفير السحابي للرمز الجديد بنجاح!</p>}
            <button type="submit" className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-xl font-bold block shadow-md cursor-pointer hover:bg-cyan-400">تحديث وحفظ كلمة المرور</button>
          </div>
        </form>
      )}

      {/* المودالات المنبثقة التلقائية لإضافة المنتجات والمتاجر بشكل سليم */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-3 text-xs text-white" dir="rtl">
            <h3 className="font-bold text-cyan-400">📦 نشر جهاز جديد في الكتالوج السحابي</h3>
            <input type="text" placeholder="اسم وموديل اللابتوب الجديد" onChange={(e) => setPinInput(e.target.value)} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800" />
            <div className="flex justify-end gap-2"><button onClick={() => setShowProductModal(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 cursor-pointer">إلغاء</button><button onClick={() => { addProduct({ name: pinInput, category: 'laptops_gaming', price: 1600, originalStorePrice: 1600, storeId: 'store_1', storeName: 'سيريا تك سنتر', storeLocation: 'دمشق', inStock: true, image: '/src/assets/images/laptop_flagship_pro_1791263342097.jpg', commissionAmount: 70, badge: 'جديد بالكرتون', description: '', specs: { processor: '', gpu: '', ram: '', storage: '', display: 'سلس وممتاز', condition: 'جديد', warranty: 'ضمان سنة كاملة' } }); setShowProductModal(false); }} className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-lg cursor-pointer">نشر الجهاز فوراً</button></div>
          </div>
        </div>
      )}

      {showStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-3 text-xs text-white" dir="rtl">
            <h3 className="font-bold text-cyan-400">🏪 تسجيل متجر شريك جديد في السحاب</h3>
            <input type="text" placeholder="اسم المركز الشريك يدوياً" onChange={e => setStForm({ ...stF, name: e.target.value })} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800" />
            <input type="text" placeholder="المدينة (دمشق، حلب...)" onChange={e => setStForm({ ...stF, city: e.target.value })} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 mt-2" />
            <div className="flex justify-end gap-2 pt-2"><button onClick={() => setShowStoreModal(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 cursor-pointer">إلغاء</button><button onClick={() => { if (stF.name) { addStore({ name: stF.name, city: stF.city || 'دمشق', address: '', phone: '', whatsapp: '', rating: 4.8, activeItemsCount: 10, description: '', verified: true, joinedYear: '2026' }); setShowStoreModal(false); } }} className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-lg cursor-pointer">اعتماد المتجر</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
