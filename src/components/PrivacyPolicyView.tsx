import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Mail, 
  FileText, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { siteConfig, theme } = useApp();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
          theme === 'dark'
            ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
            : 'bg-cyan-50 border-cyan-200 text-cyan-900'
        }`}>
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span>حماية مشددة وخصوصية مطلقة</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-slate-950'
        }`}>
          سياسة الخصوصية وأمان بيانات العملاء
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          نلتزم بحماية بياناتك الشخصية وحسابك الإلكتروني وفق أعلى معايير التشفير والشفافية.
        </p>
      </div>

      {/* Main Privacy Text Card (Editable via Admin) */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}>
        <div className={`flex items-center gap-3 border-b pb-4 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <Lock className="w-6 h-6 text-cyan-500" />
          <h2 className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            بنود وأحكام الخصوصية المعتمدة في TechsyZone
          </h2>
        </div>

        <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {siteConfig.privacyPolicy}
        </div>
      </div>

      {/* Technical Encryption Assurance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border space-y-2 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Key className="w-5 h-5 text-cyan-500" />
          <h3 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>تشفير تام لحسابات المشتركين</h3>
          <p className={`text-xs leading-relaxed font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            تُعرض عناوين البريد الإلكتروني وسجلات المشتركين بشكل مشفر ومحجوب جزئياً لمنع أي تسريب أو وصول غير مصرح به.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Mail className="w-5 h-5 text-cyan-500" />
          <h3 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>نشرات السبت البريدية المباشرة</h3>
          <p className={`text-xs leading-relaxed font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            ترسل النشرات حصراً يوم السبت من كل أسبوع بأحدث أسعار الأجهزة وكفالاتها المتوفرة بدون أي محتوى ترويجي مزعج.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <UserCheck className="w-5 h-5 text-cyan-500" />
          <h3 className={`text-sm font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>خصوصية تأكيد المشتريات</h3>
          <p className={`text-xs leading-relaxed font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            عند تأكيد استلام الجهاز، تُرسل الفاتورة مباشرة ومحمية إلى الفريق الإداري فقط لتحصيل العمولة من المتجر دون إفشاء لأي أطراف خارجية.
          </p>
        </div>
      </div>

    </div>
  );
};
