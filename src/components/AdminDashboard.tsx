import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Palette, Share2, Package, Store, DollarSign, Users, Plus, Lock, Eye, Trash2, Edit3, Clock, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { siteConfig, updateSiteConfig, products, addProduct, deleteProduct, stores, addStore, deleteStore, orders, confirmOrderAsAdmin, subscribers, sendSaturdayNewsletter, customElements, addCustomElement, deleteCustomElement, isLiveEditorActive, setIsLiveEditorActive, setIsAdminRoute, isAdminLoggedIn, adminLogin, changeAdminPassword, adminLogout } = useApp();
  const [pin, setPin] = useState(''); const [pass, setPass] = useState(''); const [tab, setTab] = useState('branding');
  const [form, setForm] = useState<any>({ ...siteConfig }); const [pModal, setPModal] = useState(false); const [sModal, setSModal] = useState(false);
  const [elTitle, setElTitle] = useState(''); const [elBtn, setElButton] = useState(''); const [elTar, setElTarget] = useState('');
  const [stF, setStForm] = useState<any>({}); const [pdF, setPdForm] = useState<any>({}); const [analytics, setAnalytics] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // تم تصحيح تضارب أسماء المتغيرات لمنع انهيار مفسر الموبايل
  useEffect(() => {
    fetch('/api/analytics', { headers: { 'x-admin-request': 'true' } })
      .then(res => res.json()).then(d => { if (d && d.success) setAnalytics(d.summary); });
  }, [refreshKey, pModal, sModal]);

  const handleReset = () => {
    if (window.confirm('⚠️ هل أنت متأكد من تصفير العداد السحابي نهائياً؟')) {
      fetch('/api/analytics', { method: 'DELETE' }).then(res => res.json()).then(d => { if (d && d.success) { alert(d.message); setRefreshKey(prev => prev + 1); } });
    }
  };
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 bg-slate-950 text-white text-xs" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto"><Lock className="w-5 h-5" /></div>
          <h2 className="text-sm font-black text-slate-200">بوابة إدارة TechsyZone السحابية</h2>
          <form onSubmit={e => { e.preventDefault(); adminLogin(pin); }} className="space-y-3">
            <input 
              type="password" 
              required 
              value={pin} 
              onChange={e => setPin(e.target.value)} 
              placeholder="أدخل رمز الحماية الفاخر للإدارة" 
              className="w-full p-3 bg-slate-950 rounded-xl text-center border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500" 
            />
            <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl cursor-pointer shadow-lg shadow-cyan-500/10 transition-colors">
              دخول المدير ←
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right text-white text-xs" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-4">
        <div><div className="text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> مزامنة MongoDB Atlas الحية نشطة</div><h1 className="text-xl font-black">إدارة منصة TechsyZone الفخمة</h1></div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => { setIsLiveEditorActive(!isLiveEditorActive); if(!isLiveEditorActive) setIsAdminRoute(false); }} className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer">{isLiveEditorActive ? 'إغلاق التحرير الحي' : '✨ تفعيل التحرير الحي الفخم'}</button>
          <button onClick={() => setIsAdminRoute(false)} className="px-3 py-2 bg-slate-800 rounded-xl flex items-center gap-1 cursor-pointer"><Eye className="w-3.5 h-3.5 text-cyan-400" /> معاينة المتجر</button>
          <button onClick={adminLogout} className="px-3 py-2 bg-rose-950/40 text-rose-400 rounded-xl cursor-pointer">خروج</button>
        </div>
      </div>

      <div className="flex justify-between items-center px-1"><span className="text-slate-400 font-bold">📊 إحصائيات رصد زوار المنصة الفعليين:</span><button onClick={handleReset} className="px-2.5 py-1 bg-rose-950/50 text-rose-400 border border-rose-800 font-black rounded-lg flex items-center gap-1 cursor-pointer"><RefreshCw className="w-3 h-3" /> تصفير عداد الزوار السحابي 🗑️</button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Users className="text-cyan-400" /><div><span className="text-[10px] text-slate-400 block">الزيارات الحقيقية</span><span className="font-black text-white">{analytics?.total || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Eye className="text-green-400" /><div><span className="text-[10px] text-slate-400 block">زيارات اليوم</span><span className="font-black text-white">{analytics?.today || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><TrendingUp className="text-amber-400" /><div><span className="text-[10px] text-slate-400 block">المتوسط اليومي</span><span className="font-black text-white">{analytics?.dailyAverage || 0}</span></div></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3"><Clock className="text-purple-400" /><div><span className="text-[10px] text-slate-400 block">الساعة الحالية</span><span className="font-black text-white">{analytics?.currentHour || 0}</span></div></div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 font-bold no-scrollbar">
        {[ {id:'branding', l:'🎨 المظهر'}, {id:'contacts', l:'📞 الروابط والشبكات'}, {id:'products', l:'📦 الأجهزة'}, {id:'stores', l:'🏪 المتاجر'}, {id:'orders', l:'💰 فواتير العمولات'}, {id:'subscribers', l:'👥 النشرة'}, {id:'builder', l:'🛠️ باني الأقسام'}, {id:'security', l:'🔒 الأمان'} ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 rounded-xl border whitespace-nowrap cursor-pointer ${tab === t.id ? 'bg-cyan-50 text-slate-950 border-cyan-400':'bg-slate-900 text-slate-300 border-slate-800'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'branding' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div><label className="text-slate-400 block mb-1">اسم المنصة الكبرى:</label><input type="text" value={form.brandName || ""} onChange={e => setForm({...form, brandName:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500" /></div>
          <div><label className="text-slate-400 block mb-1">شريط الإعلان وضمان الأسعار العلوية للزبائن:</label><textarea rows={2} value={form.announcementText || ""} onChange={e => setForm({...form, announcementText:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500" /></div>
          <button onClick={() => updateSiteConfig(form)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl cursor-pointer hover:bg-cyan-400 shadow">حفظ التغييرات</button>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="font-bold text-cyan-400">🔗 إعدادات الروابط وشبكات تواصل الموقع</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-slate-400 block mb-1">رقم الواتساب المعتمد للطلب:</label><input type="text" value={form.whatsAppNumber || ""} onChange={e => setForm({...form, whatsAppNumber:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800 focus:outline-none focus:border-cyan-500" /></div>
            <div><label className="text-slate-400 block mb-1">رابط مسنجر الفيسبوك (m.me):</label><input type="text" value={form.messengerUrl || ""} onChange={e => setForm({...form, messengerUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800 focus:outline-none focus:border-cyan-500" /></div>
            <div><label className="text-slate-400 block mb-1">رابط صفحة الفيسبوك العامة:</label><input type="text" value={form.facebookPageUrl || ""} onChange={e => setForm({...form, facebookPageUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white border border-slate-800 focus:outline-none focus:border-cyan-500" /></div>
            <div><label className="text-slate-400 block mb-1">رابط حساب الإنستغرام:</label><input type="text" value={form.instagramPageUrl || ""} onChange={e => setForm({...form, instagramPageUrl:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white border border-slate-800 focus:outline-none focus:border-cyan-500" /></div>
            <div className="sm:col-span-2"><label className="text-slate-400 block mb-1">البريد الإلكتروني للإشعارات (الإيميل):</label><input type="email" value={form.adminNotificationEmail || ""} onChange={e => setForm({...form, adminNotificationEmail:e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg text-white font-mono border border-slate-800 focus:outline-none focus:border-cyan-500" /></div>
          </div>
          <button onClick={() => updateSiteConfig(form)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl cursor-pointer hover:bg-cyan-400 shadow">حفظ وتطبيق قنوات التواصل</button>
        </div>
      )}
      {tab === 'products' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div><h3 className="font-bold text-white">📦 كتالوج الأجهزة السحابي الموحد</h3><p className="text-[11px] text-slate-400">حذف فوري صارم (Overwrite) يمنع بقاء العناصر المعلقة</p></div>
            <button onClick={() => setPModal(true)} className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-cyan-400"><Plus className="w-3.5 h-3.5" /> إضافة جهاز تفصيلي</button>
          </div>
          <div className="space-y-2">
            {products.length === 0 ? <p className="text-slate-500 text-center py-2 font-medium">لا يوجد منتجات حالياً في قاعدة البيانات (فارغ)</p> : products.map(p => (
              <div key={p.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center shadow-inner">
                <span className="font-bold text-slate-200">{p.name} <span className="text-cyan-400 font-mono">\${p.price}</span></span>
                <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-rose-950/40 text-rose-400 rounded-lg cursor-pointer hover:bg-rose-900/40"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'stores' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div><h3 className="font-bold text-white">🏪 شبكة المتاجر الشريكة المعتمدة</h3><p className="text-[11px] text-slate-400">إضافة وحذف مكاتب ومراكز الهاردوير المرتبطة بنظام الوساطة</p></div>
            <button onClick={() => setSModal(true)} className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-cyan-400"><Plus className="w-3.5 h-3.5" /> إضافة متجر</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stores.length === 0 ? <p className="text-slate-500 text-center py-4 sm:col-span-2 font-medium">لا يوجد متاجر شريكة حالياً (السجل فارغ)</p> : stores.map(s => (
              <div key={s.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-start shadow-inner">
                <div><span className="font-bold text-slate-200 block">{s.name} <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono">{s.city}</span></span></div>
                <button onClick={() => deleteStore(s.id)} className="p-1.5 bg-rose-950/40 text-rose-400 rounded-lg cursor-pointer hover:bg-rose-900/40"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-cyan-400">💰 فواتير المشتريات وعمولات الوساطة المعلقة</h3>
          <div className="space-y-2">
            {orders.length === 0 ? (
              <p className="text-slate-500 text-center py-4 font-medium">لا يوجد فواتير شراء أو عمولات معلقة حالياً (السجل فارغ)</p>
            ) : orders.map(o => (
              <div key={o.id} className="p-2.5 bg-slate-950/20 rounded-xl flex justify-between items-center border border-slate-800 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-slate-200">طلب <span className="text-cyan-400 font-mono font-bold">{o.id}</span> للعميل {o.customerName}</span>
                  <span className="text-[10px] text-slate-400">العمولة المستحقة: <span className="text-emerald-400 font-mono font-bold">\${o.commissionAmount}</span></span>
                </div>
                <button onClick={() => confirmOrderAsAdmin(o.id)} className="px-2.5 py-1 bg-cyan-600 text-slate-950 font-black rounded-lg shadow hover:bg-cyan-500 cursor-pointer">توثيق الفاتورة وتحصيلها</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold text-cyan-400">👥 بث نشرة أسعار السبت تلقائياً للمشتركين</h3>
          <textarea rows={3} value={form.saturdayDigestBody || ""} onChange={e => setForm({...form, saturdayDigestBody:e.target.value})} placeholder="لا يوجد محتوى حالي لنشرة السبت..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-cyan-500" />
          <button onClick={() => sendSaturdayNewsletter(form.saturdayDigestSubject, form.saturdayDigestBody)} className="w-full py-2 bg-emerald-600 font-bold rounded-xl text-white cursor-pointer hover:bg-emerald-500 shadow">🚀 إرسال نشرة السبت الآن للمشتركين ({subscribers.length})</button>
        </div>
      )}
      {tab === 'builder' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div><h3 className="font-bold text-white">🛠️ باني الأقسام والبوابات التفاعلية الفخمة (التحرير الحي)</h3></div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <input type="text" value={elTitle} onChange={e => setElTitle(e.target.value)} placeholder="عنوان البوابة (مثال: أجهزة مخصصة لمهندسي الديكور 3D)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
            <input type="text" value={elBtn} onChange={e => setElButton(e.target.value)} placeholder="نص الزر التفاعلي" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none" />
            <input type="text" value={elTar} onChange={e => setElTarget(e.target.value)} placeholder="رابط الوجهة أو كود المحادثة المستهدفة (URL)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none" />
            <button onClick={() => { if (!elTitle || !elBtn) return; addCustomElement({ title: elTitle, description: '', buttonText: elBtn, actionTarget: elTar || '#', actionType: 'external_url', iconName: 'Sparkles', location: 'hero_announcement', enabled: true }); setElTitle(''); setElButton(''); setElTarget(''); }} className="w-full py-2 bg-cyan-500 text-slate-950 font-black rounded-lg cursor-pointer">🚀 نشر وتثبيت البوابة الجديدة للزبائن فوراً</button>
          </div>
          <div className="space-y-1.5">
            {customElements.length === 0 ? <p className="text-slate-500 text-center py-2 font-medium">لا يوجد بوابات مخصصة مبنية حالياً (فارغ)</p> : customElements.map(elem => (
              <div key={elem.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-[11px] text-slate-300"><span>{elem.title}</span><button onClick={() => deleteCustomElement(elem.id)} className="text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></div>
            ))}
          </div>
        </div>
      )}

      {tab === 'security' && (
        <form onSubmit={e => { e.preventDefault(); changeAdminPassword(pass.trim()); }} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="font-bold flex items-center gap-1.5 text-white"><ShieldCheck className="w-4 h-4" /> تغيير رمز الأمان السري للإدارة</h3>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="أدخل الرمز السري الجديد" className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white focus:outline-none" />
          <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer">تأمين وحفظ الرمز الجديد سحابياً</button>
        </form>
      )}
      {pModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 space-y-3 max-h-[90vh] overflow-y-auto no-scrollbar text-right text-white">
            <h3 className="font-black text-sm text-cyan-400 border-b border-slate-800 pb-2">📦 نشر جهاز جديد بالمواصفات التفصيلية الكاملة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="text-slate-400 block mb-1">اسم وموديل اللابتوب:</label><input type="text" placeholder="Asus ROG Strix G16" onChange={e => setPdForm({...pdF, name: e.target.value})} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none" /></div>
              <div>
                <label className="text-slate-400 block mb-1">المتجر البائع المعتمد لديك:</label>
                <select onChange={e => { const st = stores?.find(s => s.id === e.target.value); if(st) setPdForm({...pdF, storeId: st.id, storeName: st.name}); }} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none">
                  <option value="">-- اختر من المتاجر المضافة لديك --</option>
                  {stores?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
                </select>
              </div>
              <div><label className="text-slate-400 block mb-1">السعر النهائي بالدولار (\$):</label><input type="number" placeholder="1400" onChange={e => setPdForm({...pdF, price: Number(e.target.value)})} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white font-mono focus:outline-none" /></div>
              <div><label className="text-slate-400 block mb-1">عدد القطع المتوفرة في المخزن:</label><input type="number" placeholder="3" onChange={e => setPdForm({...pdF, stock: Number(e.target.value)})} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white font-mono focus:outline-none" /></div>
              <div>
                <label className="text-slate-400 block mb-1">حالة ومظهر الجهاز:</label>
                <select onChange={e => setPdForm({...pdF, cond: e.target.value})} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none">
                  <option value="new">جديد بالكرتون (Brand New)</option>
                  <option value="open_box">Open Box</option>
                  <option value="used">مستعمل نظيف جداً (Used)</option>
                </select>
              </div>
              <div><label className="text-slate-400 block mb-1">اسم المحافظة المتواجد بها الجهاز:</label><input type="text" placeholder="دمشق" onChange={e => setPdForm({...pdF, city: e.target.value})} className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none" /></div>
            </div>
            <div className="space-y-2 border-t border-slate-800 pt-2">
              <span className="text-[11px] font-bold text-cyan-500 block">💻 العتاد الفني والمواصفات للزبائن:</span>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="المعالج (i7-14700HX)" onChange={e => setPdForm({...pdF, cpu: e.target.value})} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-white focus:outline-none" />
                <input type="text" placeholder="كرت الشاشة (RTX 4060)" onChange={e => setPdForm({...pdF, gpu: e.target.value})} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-white focus:outline-none" />
                <input type="text" placeholder="الرام (16GB DDR5)" onChange={e => setPdForm({...pdF, ram: e.target.value})} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-white focus:outline-none" />
                <input type="text" placeholder="الهارد (1TB SSD)" onChange={e => setPdForm({...pdF, ssd: e.target.value})} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-white focus:outline-none" />
              </div>
              <div className="mt-2"><input type="text" placeholder="رابط صورة الجهاز المخصصة (Image URL)" onChange={e => setPdForm({...pdF, img: e.target.value})} className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-white font-mono focus:outline-none" /></div>
              <div className="mt-2"><textarea rows={2} placeholder="تفاصيل مخصصة (كفالة المتجر، ملحقات، هدايا إضافية)..." onChange={e => setPdForm({...pdF, notes: e.target.value})} className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 leading-relaxed text-white focus:outline-none" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setPModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-slate-300 font-bold cursor-pointer">إلغاء</button>
              <button onClick={() => { if(pdF.name) { addProduct({ name: pdF.name, category: 'laptops_gaming', price: pdF.price || 1500, originalStorePrice: pdF.price || 1500, storeId: pdF.storeId || 'store_1', storeName: pdF.storeName || 'سيريا تك سنتر', storeLocation: pdF.city || 'دمشق', inStock: (pdF.stock || 1) > 0, image: pdF.img || '/src/assets/images/laptop_flagship_pro_1791263342097.jpg', commissionAmount: 70, badge: pdF.cond === 'new' ? 'جديد بالكرتون' : pdF.cond === 'open_box' ? 'Open Box' : 'مستعمل نظيف', description: pdF.notes || '', specs: { processor: pdF.cpu || '', gpu: pdF.gpu || '', ram: pdF.ram || '', storage: pdF.ssd || '', display: pdF.city || 'سلس وممتاز', condition: pdF.cond || 'جديد', warranty: 'متوفرة حسب المتجر' } }); setPModal(false); } }} className="px-5 py-2 bg-cyan-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-lg hover:bg-cyan-400">🚀 نشر وتثبيت الجهاز فوراً</button>
            </div>
          </div>
        </div>
      )}

      {showStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-3 text-xs text-white">
            <h3 className="font-bold text-cyan-400">🏪 تسجيل متجر شريك جديد في السحاب</h3>
            <input type="text" placeholder="اسم المركز الشريك يدوياً" onChange={e => setStForm({...stF, name: e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 focus:outline-none" />
            <input type="text" placeholder="المدينة (دمشق، حلب...)" onChange={e => setStForm({...stF, city: e.target.value})} className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 mt-2 focus:outline-none" />
            <div className="flex justify-end gap-2 pt-2"><button onClick={() => setShowStoreModal(false)} className="px-3 py-1.5 bg-slate-800 rounded-xl text-slate-300 cursor-pointer">إلغاء</button><button onClick={() => { if(stF.name) { addStore({ name: stF.name, city: stF.city || 'دمشق', address: '', phone: '', whatsapp: '', rating: 4.8, activeItemsCount: 10, description: '', verified: true, joinedYear: '2026' }); setShowStoreModal(false); } }} className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-lg cursor-pointer">اعتماد المتجر</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
