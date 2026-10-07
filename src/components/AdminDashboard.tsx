import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Palette, Share2, Package, DollarSign, Users, Plus, Lock, Eye, Trash2, Edit3, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { siteConfig, updateSiteConfig, products, addProduct, deleteProduct, orders, confirmOrderAsAdmin, subscribers, sendSaturdayNewsletter, customElements, addCustomElement, deleteCustomElement, isLiveEditorActive, setIsLiveEditorActive, setIsAdminRoute, isAdminLoggedIn, adminLogin, changeAdminPassword, adminLogout } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('branding');
  const [configForm, setConfigForm] = useState(siteConfig);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newElemTitle, setNewElemTitle] = useState('');
  const [newElemButton, setNewElemButton] = useState('');
  const [newElemTarget, setNewElemTarget] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // إرسال هيدر مخصص مفرز لكي لا يضيف السيرفر زيارة الآدمن للعداد الحقيقي
    fetch('/api/analytics', { headers: { 'x-admin-request': 'true' } })
      .then(res => res.json())
      .then(data => { if (data.success) setAnalytics(data.summary); });
  }, []);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 bg-slate-950 text-white" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto"><Lock /></div>
          <h2 className="text-lg font-black">بوابة إدارة TechsyZone السحابية</h2>
          <form onSubmit={e => { e.preventDefault(); adminLogin(pinInput); }} className="space-y-3">
            <input type="password" required value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="أدخل رمز الحماية الفاخر" className="w-full p-3 bg-slate-950 rounded-xl text-center font-mono border border-slate-800 text-xs" />
            <button type="submit" className="w-full p-3 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs shadow-lg">دخول المدير ←</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right text-white" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> مزامنة المصدر السحابي الموحد حية</div>
          <h1 className="text-xl font-black">إدارة منصة TechsyZone الفخمة</h1>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => { setIsLiveEditorActive(!isLiveEditorActive); if(!isLiveEditorActive) setIsAdminRoute(false); }} className="px-3 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl">{isLiveEditorActive ? 'إغلاق التحرير الحي' : '✨ تفعيل التحرير الحي الفخم'}</button>
          <button onClick={() => setIsAdminRoute(false)} className="px-3 py-2 bg-slate-800 text-xs rounded-xl flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> معاينة المتجر</button>
          <button onClick={adminLogout} className="px-3 py-2 bg-rose-950/40 text-rose-400 text-xs rounded-xl">خروج</button>
        </div>
      </div>

      {/* العداد الذكي المفلتر */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Users className="text-cyan-400" /><div><span className="text-[10px] text-slate-400 block">الزيارات الحقيقية</span><span className="font-black">{analytics?.total || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Eye className="text-green-400" /><div><span className="text-[10px] text-slate-400 block">زيارات اليوم</span><span className="font-black">{analytics?.today || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><TrendingUp className="text-amber-400" /><div><span className="text-[10px] text-slate-400 block">المتوسط اليومي</span><span className="font-black">{analytics?.dailyAverage || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Clock className="text-purple-400" /><div><span className="text-[10px] text-slate-400 block">الساعة الحالية</span><span className="font-black">{analytics?.currentHour || 0}</span></div></div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        {[ {id:'branding', l:'🎨 المظهر'}, {id:'contacts', l:'📞 الروابط والشبكات'}, {id:'products', l:'📦 الأجهزة'}, {id:'orders', l:'💰 فواتير العمولات'}, {id:'subscribers', l:'👥 النشرة'}, {id:'builder', l:'🛠️ باني البوابات'}, {id:'security', l:'🔒 الأمان'} ].map(t => (
          <button key={t.id} onClick={() => setActiveAdminTab(t.id)} className={`px-3 py-2 rounded-xl border whitespace-nowrap ${activeAdminTab === t.id ? 'bg-cyan-500 text-slate-950 border-cyan-400':'bg-slate-900 text-slate-300 border-slate-800'}`}>{t.l}</button>
        ))}
      </div>
      {activeAdminTab === 'branding' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <div><label className="text-slate-400 block mb-1">اسم المنصة الكبرى:</label><input type="text" value={configForm.brandName || "فارغ"} onChange={e => setConfigForm({...configForm, brandName:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" /></div>
          <div><label className="text-slate-400 block mb-1">شريط الإعلان وضمان الأسعار العلوية للزبائن:</label><textarea rows={2} value={configForm.announcementText || "لا يوجد إعلان حالي"} onChange={e => setConfigForm({...configForm, announcementText:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white" /></div>
          <button onClick={() => updateSiteConfig(configForm)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">حفظ التغييرات</button>
        </div>
      )}

      {activeAdminTab === 'contacts' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <h3 className="font-bold text-cyan-400">🔗 إعدادات الروابط وشبكات تواصل الموقع</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-slate-400 block mb-1">رقم الواتساب المعتمد للطلب:</label><input type="text" value={configForm.whatsAppNumber || "فارغ"} onChange={e => setConfigForm({...configForm, whatsAppNumber:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800" /></div>
            <div><label className="text-slate-400 block mb-1">رابط مسنجر الفيسبوك (m.me):</label><input type="text" value={configForm.messengerUrl || "فارغ"} onChange={e => setConfigForm({...configForm, messengerUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800" /></div>
            <div><label className="text-slate-400 block mb-1">رابط صفحة الفيسبوك العامة:</label><input type="text" value={configForm.facebookPageUrl || "لا يوجد"} onChange={e => setConfigForm({...configForm, facebookPageUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white border border-slate-800" /></div>
            <div><label className="text-slate-400 block mb-1">رابط حساب الإنستغرام:</label><input type="text" value={configForm.instagramPageUrl || "لا يوجد"} onChange={e => setConfigForm({...configForm, instagramPageUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white border border-slate-800" /></div>
            <div className="sm:col-span-2"><label className="text-slate-400 block mb-1">البريد الإلكتروني للإشعارات (الإيميل):</label><input type="email" value={configForm.adminNotificationEmail || "فارغ"} onChange={e => setConfigForm({...configForm, adminNotificationEmail:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800" /></div>
          </div>
          <button onClick={() => updateSiteConfig(configForm)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">حفظ وتطبيق قنوات التواصل</button>
        </div>
      )}

      {activeAdminTab === 'products' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div><h3 className="font-bold">📦 كتالوج الأجهزة</h3></div>
            <button onClick={() => setShowProductModal(true)} className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> إضافة جهاز</button>
          </div>
          <div className="space-y-2">
            {products.length === 0 ? <p className="text-slate-500 text-center py-2">لا يوجد منتجات حالياً (فارغ)</p> : products.map(p => (
              <div key={p.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="font-bold">{p.name} <span className="text-cyan-400 font-mono text-[11px]">\${p.price}</span></span>
                <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-rose-950/40 text-rose-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'orders' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <h3 className="font-bold text-cyan-400">💰 فواتير المشتريات وعمولات الوساطة المعلقة</h3>
          <div className="space-y-2">
            {orders.length === 0 ? (
              <p className="text-slate-500 text-center py-4 font-medium">لا يوجد فواتير أو طلبات حالية (السجل فارغ)</p>
            ) : orders.map(o => (
              <div key={o.id} className="p-2.5 bg-slate-950/20 rounded-xl flex justify-between items-center border border-slate-800">
                <div className="flex flex-col gap-0.5">
                  <span>طلب <span className="text-cyan-400 font-mono font-bold">{o.id}</span> للعميل {o.customerName}</span>
                  <span className="text-[10px] text-slate-400">العمولة المستحقة من المتجر: <span className="text-emerald-400 font-mono font-bold">\${o.commissionAmount}</span></span>
                </div>
                <button onClick={() => confirmOrderAsAdmin(o.id)} className="px-2.5 py-1 bg-cyan-600 text-slate-950 font-black rounded-lg shadow">توثيق الفاتورة وتحصيلها</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeAdminTab === 'subscribers' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <h3 className="font-bold text-cyan-400">👥 بث نشرة أسعار السبت تلقائياً للمشتركين</h3>
          <textarea rows={3} value={configForm.saturdayDigestBody || ""} onChange={e => setConfigForm({...configForm, saturdayDigestBody:e.target.value})} placeholder="لا يوجد محتوى حالي لنشرة السبت..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" />
          <button onClick={() => sendSaturdayNewsletter(configForm.saturdayDigestSubject, configForm.saturdayDigestBody)} className="w-full py-2 bg-emerald-600 font-bold rounded-xl text-white">🚀 إرسال نشرة السبت الآن للمشتركين</button>
        </div>
      )}

      {activeAdminTab === 'builder' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div><h3 className="font-bold text-white">🛠️ باني الأقسام والبوابات التفاعلية الفخمة (التحرير الحي)</h3></div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <input type="text" value={newElemTitle} onChange={e => setNewElemTitle(e.target.value)} placeholder="عنوان البوابة (مثال: أجهزة مخصصة لمهندسي الديكور 3D)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
            <input type="text" value={newElemButton} onChange={e => setNewElemButton(e.target.value)} placeholder="نص الزر التفاعلي (مثال: تصفح العروض الهندسية الكفؤة ←)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
            <input type="text" value={newElemTarget} onChange={e => setNewElemTarget(e.target.value)} placeholder="رابط الوجهة أو كود المحادثة المستهدفة (URL)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono" />
            <button onClick={() => { if (!newElemTitle || !newElemButton) return; addCustomElement({ title: newElemTitle, description: '', buttonText: newElemButton, actionTarget: newElemTarget || '#', actionType: 'external_url', iconName: 'Sparkles', location: 'hero_announcement', enabled: true }); setNewElemTitle(''); setNewElemButton(''); setNewElemTarget(''); }} className="w-full py-2 bg-cyan-500 text-slate-950 font-black rounded-lg">🚀 نشر وتثبيت البوابة الجديدة للزبائن فوراً</button>
          </div>
          <div className="space-y-1.5">
            {customElements.length === 0 ? <p className="text-slate-500 text-center py-2">لا يوجد بوابات مخصصة مبنية حالياً (فارغ)</p> : customElements.map(elem => (
              <div key={elem.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-[11px]"><span>{elem.title}</span><button onClick={() => deleteCustomElement(elem.id)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button></div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'security' && (
        <form onSubmit={e => { e.preventDefault(); changeAdminPassword(newPasswordInput.trim()); }} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <h3 className="font-bold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> تغيير رمز الأمان السري للإدارة</h3>
          <input type="password" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} placeholder="أدخل الرمز السري الجديد" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white" />
          <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-black rounded-xl">تأمين وحفظ الرمز الجديد سحابياً</button>
        </form>
      )}

      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-3 text-xs">
            <h3 className="font-bold text-cyan-400">📦 نشر جهاز جديد في الكتالوج السحابي</h3>
            <input type="text" placeholder="اسم وموديل اللابتوب الجديد" onChange={e => setPinInput(e.target.value)} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-white" />
            <div className="flex justify-end gap-2"><button onClick={() => setShowProductModal(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">إلغاء</button><button onClick={() => { addProduct({ name: pinInput, category: 'laptops_gaming', price: 1600, originalStorePrice: 1600, storeId: 'store_1', storeName: 'سيريا تك سنتر', storeLocation: 'دمشق', inStock: true, image: '/src/assets/images/laptop_flagship_pro_1791263342097.jpg', commissionAmount: 70 }); setShowProductModal(false); }} className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-lg">نشر الجهاز فوراً</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
