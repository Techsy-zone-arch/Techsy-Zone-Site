import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  ShieldAlert, 
  ShoppingBag, 
  Menu, 
  X, 
  ExternalLink,
  Laptop,
  Store,
  CreditCard,
  FileText,
  User,
  Sliders,
  Sparkles
} from 'lucide-react';

export const Header: React.FC<{ onOpenLogin: () => void; onOpenSaturdayDigest: () => void }> = ({ 
  onOpenLogin,
  onOpenSaturdayDigest 
}) => {
  const { 
    siteConfig, 
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab, 
    orders, 
    currentUser, 
    isAdminLoggedIn 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Count active orders for customer
  const myOrdersCount = currentUser 
    ? orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()).length
    : orders.length;

  const navLinks = [
    { id: 'home', label: 'الرئيسية', icon: Laptop },
    { id: 'products', label: 'الأجهزة والمنتجات', icon: ShoppingBag },
    { id: 'stores', label: 'المتاجر والوساطة', icon: Store },
    { id: 'payments', label: 'سبل الدفع', icon: CreditCard },
    { id: 'privacy', label: 'الخصوصية والأمان', icon: FileText },
  ];

  const handleNavClick = (tabId: any) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-950/90 border-slate-800/80 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Brand Title & Mark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className="group flex items-center gap-3 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            >
              <div className={`relative w-11 h-11 rounded-xl overflow-hidden border p-1 transition-all flex items-center justify-center ${
                theme === 'dark'
                  ? 'border-cyan-500/30 bg-slate-900 group-hover:border-cyan-400'
                  : 'border-cyan-300 bg-white group-hover:border-cyan-500 shadow-sm'
              }`}>
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.brandName} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono transition-colors">
                  <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>Techsy</span>
                  <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-950'}>Zone</span>
                </span>
                <span className={`text-[11px] -mt-1 font-sans hidden sm:block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'
                }`}>
                  وساطة الحواسيب واللابتوبات المعتمدة
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isActive 
                      ? theme === 'dark'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'bg-cyan-100 text-cyan-950 border border-cyan-300 shadow-sm'
                      : theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700' 
                      : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Social Buttons, Theme, Account & Admin */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Facebook button */}
            <a
              href={siteConfig.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="زوروا صفحتنا على الفيس بوك"
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-blue-950/60 border-blue-800/50 text-blue-200 hover:bg-blue-900/60 hover:text-white hover:border-blue-600'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>زوروا صفحتنا على الفيس بوك</span>
            </a>

            {/* Instagram button */}
            <a
              href={siteConfig.instagramPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="زوروا حسابنا على انستغرام"
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-rose-950/50 border-rose-800/40 text-rose-200 hover:bg-rose-900/60 hover:text-white hover:border-rose-600'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>انستغرام</span>
            </a>

            {/* Saturday Newsletter quick trigger button */}
            <button
              onClick={onOpenSaturdayDigest}
              title="نشرة أسعار السبت الأسبوعية"
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 animate-spin ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">نشرة السبت</span>
            </button>

            {/* Customer purchases log button */}
            <button
              onClick={() => handleNavClick('my-orders')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeTab === 'my-orders'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : theme === 'dark'
                    ? 'bg-slate-900 border-slate-700/80 text-slate-200 hover:border-cyan-500/50'
                    : 'bg-slate-100 border-slate-300 text-slate-900 hover:border-cyan-400 hover:bg-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>سجل مشترياتي</span>
              {myOrdersCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-cyan-400 text-slate-950">
                  {myOrdersCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              className={`p-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-cyan-700 hover:bg-slate-200'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600" />
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t space-y-2 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a
                href={siteConfig.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-blue-950/60 border-blue-800 text-blue-200'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <span>صفحتنا على الفيس بوك</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={siteConfig.instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span>حسابنا على انستغرام</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-right transition-colors ${
                    isActive 
                      ? theme === 'dark'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-cyan-100 text-cyan-950 border border-cyan-300'
                      : theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-900'
                        : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-500" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
