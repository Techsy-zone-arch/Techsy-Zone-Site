import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Store, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  DollarSign
} from 'lucide-react';

export const InvoiceModal: React.FC<{
  order: OrderItem | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  const { siteConfig, theme } = useApp();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-6 transition-colors ${
        theme === 'dark'
          ? 'bg-slate-900 border-cyan-500/40 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Actions Bar */}
        <div className={`flex items-center justify-between p-4 border-b print:hidden ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 text-xs font-mono font-bold ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>فاتورة وساطة معتمدة رسمياً</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Paper */}
        <div className={`p-6 sm:p-8 space-y-6 print:bg-white print:text-black ${
          theme === 'dark' ? 'text-slate-100 bg-slate-900' : 'text-slate-900 bg-white'
        }`}>
          
          {/* Invoice Header */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b print:border-gray-300 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-2xl font-black font-mono print:text-cyan-600 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  {siteConfig.brandName}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border font-bold print:border-gray-400 print:bg-gray-100 print:text-black ${
                  theme === 'dark'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                }`}>
                  وساطة معتمدة
                </span>
              </div>
              <p className={`text-xs font-medium print:text-gray-600 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                منظومة وساطة الحواسيب واللابتوبات الاحترافية
              </p>
            </div>

            <div className="text-right sm:text-left text-xs font-mono space-y-1">
              <div><strong className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>رقم الفاتورة:</strong> <span className={theme === 'dark' ? 'text-cyan-300 font-bold' : 'text-slate-950 font-black'}>{order.id}</span></div>
              <div><strong className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>تاريخ الطلب:</strong> <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{order.orderDate} - {order.orderTime}</span></div>
              {order.clientReceivedAt && (
                <div><strong className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>تاريخ الاستلام:</strong> <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{order.clientReceivedAt}</span></div>
              )}
            </div>
          </div>

          {/* Customer & Store Details Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-2xl border print:bg-gray-50 print:border-gray-200 ${
            theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-1.5">
              <span className={`font-bold block border-b pb-1 ${
                theme === 'dark' ? 'text-cyan-400 border-slate-800' : 'text-cyan-800 border-slate-200'
              }`}>بيانات العميل المشتري:</span>
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>الاسم: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{order.customerName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>الواتساب: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{order.customerPhone}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>البريد الإلكتروني: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{order.customerEmail}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className={`font-bold block border-b pb-1 ${
                theme === 'dark' ? 'text-cyan-400 border-slate-800' : 'text-cyan-800 border-slate-200'
              }`}>بيانات المتجر والوساطة:</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>المتجر البائع: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{order.storeName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>حالة التوثيق: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{order.status === 'confirmed_by_admin' ? 'معتمد ومؤكد رسمياً' : 'تم الاستلام من العميل'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>إشعار الفريق: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{siteConfig.adminNotificationEmail}</strong></span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className={`rounded-2xl overflow-hidden border ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <table className="w-full text-right text-xs">
              <thead className={`border-b font-bold ${
                theme === 'dark' ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                <tr>
                  <th className="p-3">اسم الجهاز / الحاسوب</th>
                  <th className="p-3">المتجر المعتمد</th>
                  <th className="p-3 text-left">السعر بالدولار ($)</th>
                  <th className="p-3 text-left">عمولة المتجر لـ TechsyZone</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-slate-800' : 'divide-slate-200'
              }`}>
                <tr>
                  <td className={`p-3 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                    {order.productName}
                  </td>
                  <td className={`p-3 font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {order.storeName}
                  </td>
                  <td className={`p-3 text-left font-mono font-black ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
                  }`}>
                    ${order.productPrice.toLocaleString()}
                  </td>
                  <td className={`p-3 text-left font-mono font-bold ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    ${order.commissionAmount.toLocaleString()}
                    <span className={`block text-[10px] font-sans font-normal ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>(مخصومة من ربح المتجر)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end">
            <div className={`w-full sm:w-72 p-4 rounded-2xl border space-y-2 text-xs ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex justify-between font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>سعر الجهاز المطلوب:</span>
                <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>${order.productPrice.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>عمولة المشتري المضافة:</span>
                <span className={`font-mono font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>$0.00 (مجاناً)</span>
              </div>
              <div className={`flex justify-between border-t pt-1.5 font-bold ${
                theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-900'
              }`}>
                <span className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>المبلغ المدفوع للمتجر:</span>
                <span className={`font-mono text-sm ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
                }`}>${order.productPrice.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between text-xs pt-1 border-t font-semibold ${
                theme === 'dark' ? 'border-slate-800/80 text-amber-300' : 'border-slate-200 text-amber-800'
              }`}>
                <span>عمولة وساطة TechsyZone المستحقة من المتجر:</span>
                <span className="font-mono font-bold">${order.commissionAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Official Thank You Message to Customer */}
          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            theme === 'dark' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
          }`}>
            <CheckCircle2 className={`w-6 h-6 mx-auto ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              رسالة شكر رسمية للعميل:
            </h4>
            <p className={`text-xs sm:text-sm font-bold ${theme === 'dark' ? 'text-cyan-200' : 'text-cyan-900'}`}>
              «شكراً لاعتمادكم على وساطتنا في TechsyZone، مع تمنياتنا أن تكون الخدمة قد نالت إعجابكم!»
            </p>
          </div>

          {/* Footer note */}
          <div className={`text-[11px] text-center border-t pt-4 font-mono font-medium ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}>
            وثيقة إلكترونية موثقة صادرة عن منصة TechsyZone للوساطة التقنية المعتمدة · البريد: {siteConfig.adminNotificationEmail}
          </div>

        </div>

      </div>
    </div>
  );
};
