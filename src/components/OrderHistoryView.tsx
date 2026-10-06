import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Store, 
  ArrowLeft, 
  DollarSign, 
  User, 
  Lock, 
  Mail, 
  Phone,
  AlertCircle,
  XCircle,
  Trash2,
  LogIn
} from 'lucide-react';

export const OrderHistoryView: React.FC<{
  onOpenCatalog: () => void;
}> = ({ onOpenCatalog }) => {
  const { 
    orders, 
    markOrderAsReceived, 
    cancelOrder,
    deleteOrder,
    setSelectedInvoiceOrder, 
    siteConfig, 
    currentUser, 
    customerLogin, 
    customerLogout,
    theme
  } = useApp();

  // Login form state
  const [authPhoneOrEmail, setAuthPhoneOrEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // Scoped strictly to the active customer
  const customerOrders = currentUser
    ? orders.filter(
        o =>
          (currentUser.email && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.phone && o.customerPhone === currentUser.phone)
      )
    : [];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhoneOrEmail.trim()) return;
    const isEmail = authPhoneOrEmail.includes('@');
    const email = isEmail ? authPhoneOrEmail : `${authPhoneOrEmail.replace(/[^0-9]/g, '')}@client.techsyzone.com`;
    const phone = !isEmail ? authPhoneOrEmail : '';
    customerLogin(email, authName || 'عميل TechsyZone', phone);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 border ${
            theme === 'dark'
              ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
              : 'bg-cyan-50 border-cyan-200 text-cyan-900'
          }`}>
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-500" />
            <span>سجل المشتريات الخاص بالزبون</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            سجل مشترياتي وطلباتي الخاصة
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            سجل خاص ومحمي لك وحدك لعرض الأجهزة التي طلبتها، تأكيد الاستلام، أو إلغاء الطلب مع إشعار الواتساب التلقائي.
          </p>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className={`flex items-center gap-3 p-2.5 rounded-2xl border text-xs ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-black">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-right">
                <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{currentUser.name}</span>
                <span className={`font-mono text-[11px] truncate max-w-[140px] block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {currentUser.phone || currentUser.email}
                </span>
              </div>
              <button
                onClick={customerLogout}
                className="text-xs text-rose-500 hover:text-rose-600 mr-2 hover:underline font-bold cursor-pointer"
              >
                تبديل الحساب
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* If Not Logged In: Prompt to access their private orders */}
      {!currentUser && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 max-w-lg mx-auto ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto ${
            theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}>
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>سجل المشتريات خاص بكل زبون</h3>
            <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              لحماية خصوصيتك التامة، لا تظهر المشتريات للعامة. يرجى إدخال رقم هاتفك أو بريدك الإلكتروني الذي استخدمته عند الطلب لعرض أجهزتك وتأكيد استلامها.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3 text-right">
            <div>
              <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>اسمك الكريم</label>
              <input
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="مثال: م. أحمد الخالد"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>رقم الواتساب أو البريد الإلكتروني</label>
              <input
                type="text"
                required
                value={authPhoneOrEmail}
                onChange={(e) => setAuthPhoneOrEmail(e.target.value)}
                placeholder="+963988112233 أو email@example.com"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono text-left focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>عرض سجل مشترياتي الخاصة</span>
            </button>
          </form>
        </div>
      )}

      {/* Orders List for Logged-In Customer */}
      {currentUser && (
        <div className="space-y-6">
          <div className={`flex items-center justify-between text-xs font-bold ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
          }`}>
            <span>عدد الطلبات في سجلك: <strong className={`font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{customerOrders.length}</strong></span>
            <button
              onClick={onOpenCatalog}
              className="text-cyan-500 hover:underline font-bold cursor-pointer"
            >
              + إضافة جهاز جديد إلى السجل
            </button>
          </div>

          {customerOrders.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <ShoppingBag className={`w-12 h-12 mx-auto ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>لا توجد طلبات مسجلة بهذا الحساب بعد</h3>
              <p className={`text-xs sm:text-sm max-w-md mx-auto font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                تصفح قائمة الأجهزة وعند اختيار أي لابتوب أو حاسوب، اختر «تثبيت في سجل مشترياتي» لتوثيقه وتأكيد استلامه أو إلغائه هنا.
              </p>
              <button
                onClick={onOpenCatalog}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                تصفح الأجهزة المتاحة
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders.map((order) => {
                const isCancelled = order.status === 'cancelled';
                const isReceived = order.status === 'received_by_client' || order.status === 'confirmed_by_admin';
                const isConfirmed = order.status === 'confirmed_by_admin';

                return (
                  <div
                    key={order.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                      isCancelled
                        ? theme === 'dark' ? 'bg-slate-900 border-rose-900/50 opacity-75' : 'bg-rose-50/50 border-rose-200'
                        : isConfirmed
                          ? theme === 'dark' ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'bg-white border-emerald-300 shadow-md'
                          : isReceived
                            ? theme === 'dark' ? 'bg-slate-900 border-cyan-500/40' : 'bg-white border-cyan-300 shadow-sm'
                            : theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Order Top Bar: Item title, date & time */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                      theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-xs font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}>#{order.id}</span>
                          <span aria-hidden="true" className={theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}>·</span>
                          <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{order.storeName}</span>
                        </div>
                        <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{order.productName}</h3>
                      </div>

                      {/* Date & Time Timestamp */}
                      <div className={`flex items-center gap-3 text-xs font-mono px-3 py-1.5 rounded-xl border shrink-0 ${
                        theme === 'dark'
                          ? 'text-slate-400 bg-slate-950 border-slate-800'
                          : 'text-slate-700 bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          <span>{order.orderDate}</span>
                        </div>
                        <span className={theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}>|</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                          <span>{order.orderTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className={`p-3 rounded-2xl border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`block mb-1 font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>السعر بالدولار ($):</span>
                        <span className={`text-xl font-black font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>${order.productPrice.toLocaleString()}</span>
                        <span className={`text-[11px] block mt-0.5 font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>عمولة المشتري: 0.00$</span>
                      </div>

                      <div className={`p-3 rounded-2xl border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`block mb-1 font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>حالة الطلب:</span>
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>تم إلغاء الطلب</span>
                          </span>
                        ) : isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم الاستلام وتوثيق الفاتورة</span>
                          </span>
                        ) : isReceived ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم الضغط على الاستلام</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                            <span>بانتظار وصول الجهاز</span>
                          </span>
                        )}
                        {order.clientReceivedAt && (
                          <span className={`text-[10px] font-mono block mt-1 font-semibold ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
                          }`}>
                            وقت التأكيد: {order.clientReceivedAt}
                          </span>
                        )}
                      </div>

                      <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <span className={`block mb-1 font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>بيانات التواصل:</span>
                          <span className={`block truncate font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{order.customerName}</span>
                          <span className={`font-mono text-[11px] block font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{order.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Row: تم الاستلام + إلغاء الطلب مع الواتساب + حذف */}
                    <div className={`pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t ${
                      theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
                    }`}>
                      <div className="text-xs text-right w-full sm:w-auto font-medium">
                        {isCancelled ? (
                          <span className="text-rose-600 font-bold">تم إرسال إشعار الإلغاء لرقم واتساب الفريق.</span>
                        ) : !isReceived ? (
                          <span className={`flex items-center gap-1.5 font-bold ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                          }`}>
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>اضغط «تم الاستلام» عند وصول وفحص الحاسوب، أو «إلغاء الطلب» لإيقافه فوراً.</span>
                          </span>
                        ) : (
                          <span className={`flex items-center gap-1.5 font-bold ${
                            theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'
                          }`}>
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                            <span>شكراً لاعتمادكم على وساطتنا في TechsyZone، مع تمنياتنا أن تكون الخدمة قد نالت إعجابكم!</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        
                        {/* 1. BUTTON: تم الاستلام */}
                        {!isReceived && !isCancelled && (
                          <button
                            onClick={() => markOrderAsReceived(order.id)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم الاستلام (وصلني الجهاز)</span>
                          </button>
                        )}

                        {/* 2. BUTTON: إلغاء الطلب (مع إشعار الواتساب التلقائي) */}
                        {!isCancelled && !isConfirmed && (
                          <button
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من رغبتك بإلغاء هذا الطلب؟ سيتم إرسال رسالة إلغاء تلقائية لواتساب الفريق.')) {
                                cancelOrder(order.id);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="إلغاء الطلب وإرسال رسالة لواتساب الفريق"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>إلغاء الطلب (واتساب)</span>
                          </button>
                        )}

                        {/* 3. BUTTON: حذف الطلب من السجل */}
                        <button
                          onClick={() => {
                            if (window.confirm('هل تريد حذف هذا الطلب نهائياً من سجلك؟')) {
                              deleteOrder(order.id);
                            }
                          }}
                          className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                            theme === 'dark'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border-slate-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 border-slate-300'
                          }`}
                          title="حذف من سجلي"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 4. BUTTON: عرض الفاتورة */}
                        {isReceived && (
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                              theme === 'dark'
                                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                                : 'bg-slate-100 hover:bg-slate-200 text-cyan-800 border-slate-300'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>عرض الفاتورة</span>
                          </button>
                        )}

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
