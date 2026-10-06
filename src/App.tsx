import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { ServerLoadingScreen } from './components/ServerLoadingScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomerOrderModal } from './components/CustomerOrderModal';
import { InvoiceModal } from './components/InvoiceModal';
import { PartnerStoresView } from './components/PartnerStoresView';
import { PaymentMethodsView } from './components/PaymentMethodsView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { SaturdayNewsletterModal } from './components/SaturdayNewsletterModal';
import { LiveVisualEditor } from './components/LiveVisualEditor';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { Product } from './types';
import { 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  X, 
  ArrowUp
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    siteConfig, 
    theme, 
    isAdminRoute, 
    setIsAdminRoute,
    activeTab, 
    setActiveTab, 
    isServerLoading,
    isLiveEditorActive,
    selectedInvoiceOrder, 
    setSelectedInvoiceOrder, 
    selectedProduct, 
    setSelectedProduct 
  } = useApp();

  const [splashFinished, setSplashFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productToOrder, setProductToOrder] = useState<Product | null>(null);
  const [isSaturdayModalOpen, setIsSaturdayModalOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // 1. If server is loading initial data, show the exact requested screen
  if (isServerLoading) {
    return <ServerLoadingScreen />;
  }

  // 2. If URL is /administrationlink, show the standalone Admin Dashboard!
  if (isAdminRoute) {
    return (
      <div className={`min-h-screen font-sans ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100 tech-grid-bg' : 'bg-slate-50 text-slate-900 tech-grid-bg-light'
      }`}>
        <AdminDashboard />
        <ToastContainer />
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      </div>
    );
  }

  // 3. Main Customer Storefront (Public View - completely free of admin buttons)
  const scrollToCatalogOnHome = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('products');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100 tech-grid-bg' 
        : 'bg-slate-50 text-slate-900 tech-grid-bg-light'
    }`}>
      
      {/* 1. Splash Screen Intro with auto-responsive logo fade out */}
      {!splashFinished && (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      )}

      {/* 2. Top Dismissible Announcement Banner */}
      {!announcementDismissed && siteConfig.announcementActive && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-b border-cyan-500/30 text-cyan-200 text-xs py-2 px-4 text-center relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 pr-6 pl-6">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">
              {siteConfig.announcementText}
            </span>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-cyan-400/70 hover:text-cyan-200"
              title="إغلاق التنبيه"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Header Bar (Clean, without admin link) */}
      <Header
        onOpenLogin={() => setActiveTab('my-orders')}
        onOpenSaturdayDigest={() => setIsSaturdayModalOpen(true)}
      />

      {/* 4. Page View Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onExploreCatalog={scrollToCatalogOnHome}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Catalog Section on Home */}
            <ProductCatalog
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenQuickOrder={(p) => setProductToOrder(p)}
            />

            {/* Saturday Newsletter Promotional Banner */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>نظام النشرات الأسبوعية ليوم السبت</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    نشرة أسعار أسبوعية تلقائية كل سبت لحسابك
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    اربط حسابك لتصلك رسالة إلكترونية أسبوعية كل يوم سبت بأحدث الأجهزة والأسعار الواصلة للمتاجر المعتمدة، مع التشفير التام لبياناتك.
                  </p>
                </div>

                <button
                  onClick={() => setIsSaturdayModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 shrink-0 transition-all"
                >
                  تفعيل نشرة السبت لحسابي
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="pt-4">
            <ProductCatalog
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenQuickOrder={(p) => setProductToOrder(p)}
            />
          </div>
        )}

        {activeTab === 'stores' && <PartnerStoresView />}

        {activeTab === 'payments' && <PaymentMethodsView />}

        {activeTab === 'privacy' && <PrivacyPolicyView />}

        {activeTab === 'my-orders' && (
          <OrderHistoryView onOpenCatalog={() => setActiveTab('products')} />
        )}
      </main>

      {/* 5. Modals & Popups */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenOrderModal={(p) => setProductToOrder(p)}
      />

      <CustomerOrderModal
        product={productToOrder}
        onClose={() => setProductToOrder(null)}
        onSuccess={() => setActiveTab('my-orders')}
      />

      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      <SaturdayNewsletterModal
        isOpen={isSaturdayModalOpen}
        onClose={() => setIsSaturdayModalOpen(false)}
      />

      {/* 6. Live Visual Editor Floating Dock (when enabled from /administrationlink) */}
      {isLiveEditorActive && <LiveVisualEditor />}

      {/* 7. Notification Toasts */}
      <ToastContainer />

      {/* 8. Floating Action Button: WhatsApp Order & Help */}
      <div className="fixed bottom-6 right-6 z-30">
        <a
          href={`https://wa.me/${siteConfig.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً TechsyZone، أود الاستفسار عن الأجهزة والطلب عبر وساطتكم المعتمدة.')}`}
          target="_blank"
          rel="noreferrer"
          title="تواصل مباشر عبر واتساب"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">طلب ومساعدة عبر واتساب</span>
        </a>
      </div>

      {/* 9. Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
