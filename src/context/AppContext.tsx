import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  PartnerStore, 
  OrderItem, 
  Subscriber, 
  PaymentMethod, 
  CustomBuilderElement, 
  SiteConfig 
} from '../types';
import { 
  initialSiteConfig, 
  initialProducts, 
  initialPartnerStores, 
  initialOrders, 
  initialSubscribers, 
  initialPaymentMethods, 
  initialCustomBuilderElements 
} from '../data/initialData';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface CloudBackupInfo {
  lastSync?: string;
  fileName?: string;
  sizeBytes?: number;
  email?: string;
}

interface AppContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  resetSiteConfig: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAdminRoute: boolean;
  setIsAdminRoute: (val: boolean) => void;
  activeTab: 'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders';
  setActiveTab: (tab: 'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders') => void;
  isServerLoading: boolean;
  serverSyncStatus: 'synced' | 'syncing' | 'error';
  triggerServerSync: () => Promise<void>;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  stores: PartnerStore[];
  addStore: (store: Omit<PartnerStore, 'id'>) => void;
  updateStore: (id: string, store: Partial<PartnerStore>) => void;
  deleteStore: (id: string) => void;
  paymentMethods: PaymentMethod[];
  updatePaymentMethods: (methods: PaymentMethod[]) => void;
  customElements: CustomBuilderElement[];
  addCustomElement: (elem: Omit<CustomBuilderElement, 'id'>) => void;
  updateCustomElement: (id: string, elem: Partial<CustomBuilderElement>) => void;
  deleteCustomElement: (id: string) => void;
  orders: OrderItem[];
  createOrder: (data: { customerName: string; customerPhone: string; customerEmail: string; product: Product; notes?: string }) => OrderItem;
  markOrderAsReceived: (orderId: string) => void;
  confirmOrderAsAdmin: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  selectedInvoiceOrder: OrderItem | null;
  setSelectedInvoiceOrder: (order: OrderItem | null) => void;
  subscribers: Subscriber[];
  subscribeToWeeklyDigest: (email: string, name?: string, phone?: string) => boolean;
  deleteSubscriber: (subscriberId: string) => void;
  sendSaturdayNewsletter: (subject?: string, body?: string) => { count: number; date: string };
  cloudBackupInfo: CloudBackupInfo | null;
  syncGoogleDriveBackup: (customEmail?: string) => Promise<boolean>;
  isLiveEditorActive: boolean;
  setIsLiveEditorActive: (val: boolean) => void;
  currentUser: CustomerUser | null;
  customerLogin: (email: string, name: string, phone: string) => void;
  customerLogout: () => void;
  isAdminLoggedIn: boolean;
  adminLogin: (pass: string) => boolean;
  changeAdminPassword: (newPass: string) => boolean;
  adminLogout: () => void;
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  addToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('/administrationlink') || hash.includes('/administrationlink');
  };

  const [isAdminRoute, setIsAdminRouteState] = useState<boolean>(checkIsAdminRoute);

  const setIsAdminRoute = (val: boolean) => {
    setIsAdminRouteState(val);
    if (val) {
      if (window.location.pathname !== '/administrationlink') {
        window.history.pushState({}, '', '/administrationlink');
      }
    } else {
      if (window.location.pathname === '/administrationlink') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const [isServerLoading, setIsServerLoading] = useState<boolean>(true);
  const [serverSyncStatus, setServerSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders'>('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stores, setStores] = useState<PartnerStore[]>(initialPartnerStores);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [customElements, setCustomElements] = useState<CustomBuilderElement[]>(initialCustomBuilderElements);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cloudBackupInfo, setCloudBackupInfo] = useState<CloudBackupInfo | null>(null);
  const [isLiveEditorActive, setIsLiveEditorActive] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const triggerServerSync = useCallback(async (
    currentConfig = siteConfig,
    currentProducts = products,
    currentStores = stores,
    currentPayments = paymentMethods,
    currentElements = customElements,
    currentOrders = orders,
    currentSubs = subscribers,
    currentTheme = theme
  ) => {
    setServerSyncStatus('syncing');
    try {
      const payload = {
        siteConfig: currentConfig,
        products: currentProducts,
        stores: currentStores,
        paymentMethods: currentPayments,
        customElements: currentElements,
        orders: currentOrders,
        subscribers: currentSubs,
        theme: currentTheme
      };
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setServerSyncStatus('synced');
      } else {
        setServerSyncStatus('error');
      }
    } catch (e) {
      setServerSyncStatus('error');
    }
  }, [siteConfig, products, stores, paymentMethods, customElements, orders, subscribers, theme]);

  useEffect(() => {
    let isMounted = true;
    
    const initAppState = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok && isMounted) {
          const json = await res.json();
          if (json.data) {
            const d = json.data;
            if (d.siteConfig) setSiteConfig(d.siteConfig);
            if (d.products) setProducts(d.products);
            if (d.stores) setStores(d.stores);
            if (d.paymentMethods) setPaymentMethods(d.paymentMethods);
            if (d.customElements) setCustomElements(d.customElements);
            if (d.orders) setOrders(d.orders);
            if (d.subscribers) setSubscribers(d.subscribers);
            
            const activeTheme = d.theme || d.siteConfig?.customTheme || 'dark';
            setTheme(activeTheme);
            if (activeTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }

            const maxWidth = d.siteConfig?.customDimensions || d.siteConfig?.themeSettings?.containerMaxWidth || '1280px';
            const brandColor = d.siteConfig?.themeSettings?.primaryColor || '#0891b2';
            document.documentElement.style.setProperty('--primary-color', brandColor);
            document.documentElement.style.setProperty('--site-max-width', maxWidth);
          }
        }
      } catch (err) {
        console.warn('Backend server fallback:', err);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsServerLoading(false), 400);
        }
      }
    };

    const handlePopState = () => {
      if (isMounted) setIsAdminRouteState(checkIsAdminRoute());
    };
    
    initAppState();
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, orders, subscribers, nextTheme);
  };

  const updateSiteConfig = (partial: Partial<SiteConfig>) => {
    const nextConfig = { ...siteConfig, ...partial };
    setSiteConfig(nextConfig);
    if (partial.customDimensions) {
      document.documentElement.style.setProperty('--site-max-width', partial.customDimensions);
    }
    triggerServerSync(nextConfig, products, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('success', 'تم حفظ التعديلات أونلاين', 'تم تحديث إعدادات المتجر وحفظها في قاعدة البيانات السحابية');
  };

  const resetSiteConfig = () => {
    setSiteConfig(initialSiteConfig);
    triggerServerSync(initialSiteConfig, products, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('info', 'إعادة الضبط', 'تمت استعادة إعدادات الهوية الافتراضية');
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = { ...prodData, id: 'prod_' + Date.now() };
    const nextProducts = [newProd, ...products];
    setProducts(nextProducts);
    triggerServerSync(siteConfig, nextProducts, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('success', 'تمت إضافة المنتج أونلاين', `تم نشر ${prodData.name} وحفظه بالسيرفر بنجاح`);
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    const nextProducts = products.map(p => (p.id === id ? { ...p, ...prodData } : p));
    setProducts(nextProducts);
    triggerServerSync(siteConfig, nextProducts, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('success', 'تم تحديث المنتج', 'تم حفظ التعديلات بنجاح على السيرفر');
  };

  const deleteProduct = (id: string) => {
    const nextProducts = products.filter(p => p.id !== id);
    setProducts(nextProducts);
    triggerServerSync(siteConfig, nextProducts, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('info', 'حذف منتج', 'تم حذف الجهاز من السيرفر والمتجر');
  };

  const addStore = (storeData: Omit<PartnerStore, 'id'>) => {
    const newStore: PartnerStore = { ...storeData, id: 'store_' + Date.now() };
    const nextStores = [newStore, ...stores];
    setStores(nextStores);
    triggerServerSync(siteConfig, products, nextStores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('success', 'تم إضافة المتجر', `تم حفظ ${storeData.name} بالسيرفر`);
  };

  const updateStore = (id: string, storeData: Partial<PartnerStore>) => {
    const nextStores = stores.map(s => (s.id === id ? { ...s, ...storeData } : s));
    setStores(nextStores);
    triggerServerSync(siteConfig, products, nextStores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('success', 'تم التحديث', 'تم حفظ معلومات المتجر الشريك');
  };

  const deleteStore = (id: string) => {
    const nextStores = stores.filter(s => s.id !== id);
    setStores(nextStores);
    triggerServerSync(siteConfig, products, nextStores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('info', 'حذف متجر', 'تم حذف المتجر من شبكة الشركاء بالسيرفر');
  };

  const updatePaymentMethods = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
    triggerServerSync(siteConfig, products, stores, methods, customElements, orders, subscribers, theme);
    addToast('success', 'سبل الدفع', 'تم حفظ خيارات وطرق الدفع بالسيرفر بنجاح');
  };

  const addCustomElement = (elemData: Omit<CustomBuilderElement, 'id'>) => {
    const newElem: CustomBuilderElement = { ...elemData, id: 'elem_' + Date.now() };
    const nextElements = [...customElements, newElem];
    setCustomElements(nextElements);
    triggerServerSync(siteConfig, products, stores, paymentMethods, nextElements, orders, subscribers, theme);
    addToast('success', 'عنصر جديد', 'تم نشر العنصر الجديد على الموقع وحفظه بالسيرفر');
  };

  const updateCustomElement = (id: string, elemData: Partial<CustomBuilderElement>) => {
    const nextElements = customElements.map(e => (e.id === id ? { ...e, ...elemData } : e));
    setCustomElements(nextElements);
    triggerServerSync(siteConfig, products, stores, paymentMethods, nextElements, orders, subscribers, theme);
    addToast('success', 'تم التحديث', 'تم حفظ التعديل');
  };

  const deleteCustomElement = (id: string) => {
    const nextElements = customElements.filter(e => e.id !== id);
    setCustomElements(nextElements);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, orders, subscribers, theme);
    addToast('info', 'حذف عنصر', 'تمت إزالة العنصر من الواجهة');
  };

  const createOrder = ({
    customerName,
    customerPhone,
    customerEmail,
    product,
    notes
  }: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    product: Product;
    notes?: string;
  }): OrderItem => {
    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const orderTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const newOrder: OrderItem = {
      id: 'ORD-' + now.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      customerName,
      customerPhone,
      customerEmail,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      storeId: product.storeId,
      storeName: product.storeName,
      commissionAmount: product.commissionAmount,
      orderDate,
      orderTime,
      status: 'pending',
      notes
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    setCurrentUser({
      id: 'user_' + Date.now(),
      name: customerName,
      email: customerEmail,
      phone: customerPhone
    });

    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, nextOrders, subscribers, theme);
    addToast('success', 'تم تثبيت طلبك في سجلك الخاص أونلاين!', `تم تسجيل طلب ${product.name} برقم ${newOrder.id}.`);
    return newOrder;
  };

  const markOrderAsReceived = (orderId: string) => {
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    const nextOrders = orders.map(ord => (ord.id === orderId ? { ...ord, status: 'received_by_client' as const, clientReceivedAt: timestampStr } : ord));
    
    setOrders(nextOrders);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, nextOrders, subscribers, theme);
    addToast('success', 'تم تأكيد الاستلام بنجاح!', 'شكراً لتأكيدك! تم إرسال إشعار فوري لفريق TechsyZone.');
  };

  const cancelOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const nextOrders = orders.map(ord => (ord.id === orderId ? { ...ord, status: 'cancelled' as const } : ord));
    setOrders(nextOrders);

    const cleanNumber = siteConfig.whatsappNumber ? siteConfig.whatsappNumber.replace(/[^0-9]/g, '') : '';
    const cancelMsg = encodeURIComponent(`تم إلغاء الطلب رسمياً من العميل:\n• رقم الطلب: ${targetOrder.id}\n• الجهاز: ${targetOrder.productName}`);
    window.open(`https://wa.me/${cleanNumber}?text=${cancelMsg}`, '_blank');

    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, nextOrders, subscribers, theme);
    addToast('info', 'تم إلغاء الطلب وإرسال إشعار للواتساب', `تم إلغاء الطلب #${orderId}`);
  };

  const deleteOrder = (orderId: string) => {
    const nextOrders = orders.filter(o => o.id !== orderId);
    setOrders(nextOrders);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, nextOrders, subscribers, theme);
    addToast('info', 'تم مسح الطلب', 'تمت إزالة الطلب من السجل وقاعدة البيانات');
  };

  const confirmOrderAsAdmin = (orderId: string) => {
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    const nextOrders = orders.map(ord => {
      if (ord.id === orderId) {
        const updated = { ...ord, status: 'confirmed_by_admin' as const, adminConfirmedAt: timestampStr, clientReceivedAt: ord.clientReceivedAt || timestampStr };
        setSelectedInvoiceOrder(updated);
        return updated;
      }
      return ord;
    });

    setOrders(nextOrders);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, nextOrders, subscribers, theme);
    addToast('success', 'تم توثيق الفاتورة وتحصيل العمولة!', 'تم اعتماد الطلب رسمياً بالسيرفر.');
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : user[0] + '***';
    const domainParts = domain.split('.');
    return `${maskedUser}@${domainParts[0]}***.${domainParts.slice(1).join('.')}`;
  };

  const subscribeToWeeklyDigest = (email: string, name = 'مشترك مميز', phone = '') => {
    if (!email || !email.includes('@')) return false;
    const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newSub: Subscriber = { id: 'sub_' + Date.now(), email, maskedEmail: maskEmail(email), name, phone, subscribedDate: new Date().toISOString().split('T')[0], status: 'active' };
    const nextSubs = [newSub, ...subscribers];
    setSubscribers(nextSubs);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, orders, nextSubs, theme);
    return true;
  };

  const deleteSubscriber = (subscriberId: string) => {
    const nextSubs = subscribers.filter(s => s.id !== subscriberId);
    setSubscribers(nextSubs);
    triggerServerSync(siteConfig, products, stores, paymentMethods, customElements, orders, nextSubs, theme);
    addToast('info', 'حذف مشترك', 'تم حذف المشترك من قائمة النشرات وقاعدة البيانات');
  };

  const sendSaturdayNewsletter = (subject?: string, body?: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const activeSubs = subscribers.filter(s => s.status === 'active');
    const nextSubs = subscribers.map(s => (s.status === 'active' ? { ...s, lastDigestSentDate: dateStr } : s));
    
    setSubscribers(nextSubs);
    const nextConfig = { ...siteConfig, saturdayDigestLastRun: `${dateStr} (${now.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })})`, ...(subject ? { saturdayDigestSubject: subject } : {}), ...(body ? { saturdayDigestBody: body } : {}) };
    setSiteConfig(nextConfig);
    
    triggerServerSync(nextConfig, products, stores, paymentMethods, customElements, orders, nextSubs, theme);
    return { count: activeSubs.length, date: dateStr };
  };

  const syncGoogleDriveBackup = async (customEmail?: string): Promise<boolean> => {
    const targetEmail = customEmail || siteConfig.backupDriveEmail || 'yoashaheen@gmail.com';
    try {
      const res = await fetch('/api/backup-drive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ backupEmail: targetEmail }) });
      if (res.ok) {
        const json = await res.json();
        const info = { lastSync: new Date().toLocaleString('ar-SY'), fileName: json.snapshotInfo?.fileName, sizeBytes: json.snapshotInfo?.sizeBytes, email: targetEmail };
        setCloudBackupInfo(info);
        return true;
      }
    } catch (e) { console.warn(e); }
    return true;
  };

  const customerLogin = (email: string, name: string, phone: string) => {
    const user = { id: 'user_' + Date.now(), name: name || 'عميل TechsyZone', email, phone };
    setCurrentUser(user);
    subscribeToWeeklyDigest(email, user.name, user.phone);
  };

  const customerLogout = () => setCurrentUser(null);
  
  const adminLogin = (pass: string) => {
    if (pass === (siteConfig.adminPassword || '262028Yosh@@')) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass || newPass.trim().length < 4) return false;
    updateSiteConfig({ adminPassword: newPass.trim() });
    return true;
  };

  const adminLogout = () => setIsAdminLoggedIn(false);

  return (
    <AppContext.Provider
      value={{
        siteConfig, updateSiteConfig, resetSiteConfig, theme, toggleTheme,
        isAdminRoute, setIsAdminRoute, activeTab, setActiveTab, isServerLoading,
        serverSyncStatus, triggerServerSync, products, addProduct, updateProduct, deleteProduct,
        stores, addStore, updateStore, deleteStore, paymentMethods, updatePaymentMethods,
        customElements, addCustomElement, updateCustomElement, deleteCustomElement, orders,
        createOrder, markOrderAsReceived, confirmOrderAsAdmin, cancelOrder, deleteOrder,
        selectedInvoiceOrder, setSelectedInvoiceOrder, subscribers, subscribeToWeeklyDigest,
        deleteSubscriber, sendSaturdayNewsletter, cloudBackupInfo, syncGoogleDriveBackup,
        isLiveEditorActive, setIsLiveEditorActive, currentUser, customerLogin, customerLogout,
        isAdminLoggedIn, adminLogin, changeAdminPassword, adminLogout, notifications,
        dismissNotification, addToast, selectedProduct, setSelectedProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
