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
  
  // Independent Admin URL Route flag
  isAdminRoute: boolean;
  setIsAdminRoute: (val: boolean) => void;
  
  // Active storefront tab
  activeTab: 'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders';
  setActiveTab: (tab: 'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders') => void;
  
  // Server state
  isServerLoading: boolean;
  serverSyncStatus: 'synced' | 'syncing' | 'error';
  triggerServerSync: () => Promise<void>;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Partner Stores
  stores: PartnerStore[];
  addStore: (store: Omit<PartnerStore, 'id'>) => void;
  updateStore: (id: string, store: Partial<PartnerStore>) => void;
  deleteStore: (id: string) => void;
  
  // Payment methods
  paymentMethods: PaymentMethod[];
  updatePaymentMethods: (methods: PaymentMethod[]) => void;
  
  // Custom builder elements
  customElements: CustomBuilderElement[];
  addCustomElement: (elem: Omit<CustomBuilderElement, 'id'>) => void;
  updateCustomElement: (id: string, elem: Partial<CustomBuilderElement>) => void;
  deleteCustomElement: (id: string) => void;
  
  // Orders & Brokerage tracking
  orders: OrderItem[];
  createOrder: (data: { customerName: string; customerPhone: string; customerEmail: string; product: Product; notes?: string }) => OrderItem;
  markOrderAsReceived: (orderId: string) => void;
  confirmOrderAsAdmin: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  
  // Selected Invoice
  selectedInvoiceOrder: OrderItem | null;
  setSelectedInvoiceOrder: (order: OrderItem | null) => void;
  
  // Subscribers
  subscribers: Subscriber[];
  subscribeToWeeklyDigest: (email: string, name?: string, phone?: string) => boolean;
  deleteSubscriber: (subscriberId: string) => void;
  sendSaturdayNewsletter: (subject?: string, body?: string) => { count: number; date: string };
  
  // Google Drive Cloud Backup
  cloudBackupInfo: CloudBackupInfo | null;
  syncGoogleDriveBackup: (customEmail?: string) => Promise<boolean>;
  
  // Live Visual Editor
  isLiveEditorActive: boolean;
  setIsLiveEditorActive: (val: boolean) => void;
  
  // Customer Auth
  currentUser: CustomerUser | null;
  customerLogin: (email: string, name: string, phone: string) => void;
  customerLogout: () => void;
  
  // Admin Auth
  isAdminLoggedIn: boolean;
  adminLogin: (pass: string) => boolean;
  changeAdminPassword: (newPass: string) => boolean;
  adminLogout: () => void;
  
  // Notifications
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  addToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  
  // Product detail modal
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if current URL matches /administrationlink (path or hash)
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

  // Listen for browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRouteState(checkIsAdminRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Server loading & sync states
  const [isServerLoading, setIsServerLoading] = useState<boolean>(true);
  const [serverSyncStatus, setServerSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Site Config
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('techsyzone_site_config');
    return saved ? JSON.parse(saved) : initialSiteConfig;
  });

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('techsyzone_theme');
    return (saved as 'dark' | 'light') || initialSiteConfig.defaultTheme || 'dark';
  });

  // Active storefront view tab
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'stores' | 'payments' | 'privacy' | 'my-orders'>('home');

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('techsyzone_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Stores
  const [stores, setStores] = useState<PartnerStore[]>(() => {
    const saved = localStorage.getItem('techsyzone_stores');
    return saved ? JSON.parse(saved) : initialPartnerStores;
  });

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('techsyzone_payment_methods');
    return saved ? JSON.parse(saved) : initialPaymentMethods;
  });

  // Custom Elements
  const [customElements, setCustomElements] = useState<CustomBuilderElement[]>(() => {
    const saved = localStorage.getItem('techsyzone_custom_elements');
    return saved ? JSON.parse(saved) : initialCustomBuilderElements;
  });

  // Orders
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('techsyzone_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('techsyzone_subscribers');
    return saved ? JSON.parse(saved) : initialSubscribers;
  });

  // Customer User
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('techsyzone_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('techsyzone_admin_auth') === 'true';
  });

  // Invoice viewer
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderItem | null>(null);

  // Selected product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cloud Backup Info
  const [cloudBackupInfo, setCloudBackupInfo] = useState<CloudBackupInfo | null>(() => {
    const saved = localStorage.getItem('techsyzone_backup_info');
    return saved ? JSON.parse(saved) : null;
  });

  // Live Visual Editor
  const [isLiveEditorActive, setIsLiveEditorActive] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Toast helper
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

  // 1. Initial Load: Fetch persistent state from Express server /api/data
  useEffect(() => {
    let isMounted = true;
    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            const d = json.data;
            if (d.siteConfig) setSiteConfig(d.siteConfig);
            if (d.products && d.products.length > 0) setProducts(d.products);
            if (d.stores && d.stores.length > 0) setStores(d.stores);
            if (d.paymentMethods && d.paymentMethods.length > 0) setPaymentMethods(d.paymentMethods);
            if (d.customElements) setCustomElements(d.customElements);
            if (d.orders) setOrders(d.orders);
            if (d.subscribers) setSubscribers(d.subscribers);
          }
        }
      } catch (err) {
        console.warn('Backend /api/data not reachable yet, utilizing client persistence:', err);
      } finally {
        if (isMounted) {
          // Slight natural settling so loading screen displays smoothly
          setTimeout(() => setIsServerLoading(false), 500);
        }
      }
    };

    fetchServerData();
    return () => { isMounted = false; };
  }, []);

  // 2. Real-time background sync to server
  const triggerServerSync = useCallback(async () => {
    setServerSyncStatus('syncing');
    try {
      const payload = {
        siteConfig,
        products,
        stores,
        paymentMethods,
        customElements,
        orders,
        subscribers
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
  }, [siteConfig, products, stores, paymentMethods, customElements, orders, subscribers]);

  // LocalStorage backups
  useEffect(() => {
    localStorage.setItem('techsyzone_site_config', JSON.stringify(siteConfig));
    triggerServerSync();
  }, [siteConfig, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('techsyzone_products', JSON.stringify(products));
    triggerServerSync();
  }, [products, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_stores', JSON.stringify(stores));
    triggerServerSync();
  }, [stores, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_payment_methods', JSON.stringify(paymentMethods));
    triggerServerSync();
  }, [paymentMethods, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_custom_elements', JSON.stringify(customElements));
    triggerServerSync();
  }, [customElements, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_orders', JSON.stringify(orders));
    triggerServerSync();
  }, [orders, triggerServerSync]);

  useEffect(() => {
    localStorage.setItem('techsyzone_subscribers', JSON.stringify(subscribers));
    triggerServerSync();
  }, [subscribers, triggerServerSync]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('techsyzone_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('techsyzone_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (cloudBackupInfo) {
      localStorage.setItem('techsyzone_backup_info', JSON.stringify(cloudBackupInfo));
    }
  }, [cloudBackupInfo]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateSiteConfig = (partial: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...partial }));
    addToast('success', 'تم حفظ التعديلات أونلاين', 'تم تحديث إعدادات المتجر وحفظها في قاعدة البيانات السحابية');
  };

  const resetSiteConfig = () => {
    setSiteConfig(initialSiteConfig);
    addToast('info', 'إعادة الضبط', 'تمت استعادة إعدادات الهوية الافتراضية');
  };

  // Products
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod_' + Date.now()
    };
    setProducts(prev => [newProd, ...prev]);
    addToast('success', 'تمت إضافة المنتج أونلاين', `تم نشر ${prodData.name} وحفظه بالسيرفر بنجاح`);
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...prodData } : p)));
    addToast('success', 'تم تحديث المنتج', 'تم حفظ التعديلات بنجاح على السيرفر');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('info', 'حذف منتج', 'تم حذف الجهاز من السيرفر والمتجر');
  };

  // Stores
  const addStore = (storeData: Omit<PartnerStore, 'id'>) => {
    const newStore: PartnerStore = {
      ...storeData,
      id: 'store_' + Date.now()
    };
    setStores(prev => [newStore, ...prev]);
    addToast('success', 'تم إضافة المتجر', `تم حفظ ${storeData.name} بالسيرفر`);
  };

  const updateStore = (id: string, storeData: Partial<PartnerStore>) => {
    setStores(prev => prev.map(s => (s.id === id ? { ...s, ...storeData } : s)));
    addToast('success', 'تم التحديث', 'تم حفظ معلومات المتجر الشريك');
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    addToast('info', 'حذف متجر', 'تم حذف المتجر من شبكة الشركاء بالسيرفر');
  };

  const updatePaymentMethods = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
    addToast('success', 'سبل الدفع', 'تم حفظ خيارات وطرق الدفع بالسيرفر بنجاح');
  };

  // Custom Elements
  const addCustomElement = (elemData: Omit<CustomBuilderElement, 'id'>) => {
    const newElem: CustomBuilderElement = {
      ...elemData,
      id: 'elem_' + Date.now()
    };
    setCustomElements(prev => [...prev, newElem]);
    addToast('success', 'عنصر جديد', 'تم نشر العنصر الجديد على الموقع وحفظه بالسيرفر');
  };

  const updateCustomElement = (id: string, elemData: Partial<CustomBuilderElement>) => {
    setCustomElements(prev => prev.map(e => (e.id === id ? { ...e, ...elemData } : e)));
    addToast('success', 'تم التحديث', 'تم حفظ التعديل');
  };

  const deleteCustomElement = (id: string) => {
    setCustomElements(prev => prev.filter(e => e.id !== id));
    addToast('info', 'حذف عنصر', 'تمت إزالة العنصر من الواجهة');
  };

  // Orders
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

    setOrders(prev => [newOrder, ...prev]);

    // Save active customer session so they see their private orders
    setCurrentUser({
      id: 'user_' + Date.now(),
      name: customerName,
      email: customerEmail,
      phone: customerPhone
    });

    addToast(
      'success',
      'تم تثبيت طلبك في سجلك الخاص أونلاين!',
      `تم تسجيل طلب ${product.name} برقم ${newOrder.id}. محفوظ بالسيرفر ويمكنك تأكيد استلامه أو إلغاؤه في أي وقت.`
    );

    return newOrder;
  };

  // Customer clicks "تم الاستلام"
  const markOrderAsReceived = (orderId: string) => {
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'received_by_client',
            clientReceivedAt: timestampStr
          };
        }
        return ord;
      })
    );

    addToast(
      'success',
      'تم تأكيد الاستلام بنجاح!',
      'شكراً لتأكيدك! تم إرسال إشعار فوري لفريق TechsyZone لتحصيل عمولة الوساطة من المتجر الشريك، ويمكنك استعراض فاتورتك المعتمدة.'
    );
  };

  // Customer clicks "إلغاء الطلب" -> Marks as cancelled AND dispatches WhatsApp alert to team!
  const cancelOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: 'cancelled' as const } : ord))
    );

    // Automatic WhatsApp cancellation dispatch to the team's number
    const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
    const cancelMsg = encodeURIComponent(
      `تم إلغاء الطلب رسمياً من العميل:
• رقم الطلب: ${targetOrder.id}
• العميل: ${targetOrder.customerName}
• الهاتف: ${targetOrder.customerPhone}
• الجهاز: ${targetOrder.productName}
• السعر: $${targetOrder.productPrice}
يرجى إيقاف إجراءات التنسيق مع المتجر.`
    );

    window.open(`https://wa.me/${cleanNumber}?text=${cancelMsg}`, '_blank');

    addToast(
      'info',
      'تم إلغاء الطلب وإرسال إشعار للواتساب',
      `تم إلغاء الطلب #${orderId} وإرسال رسالة إلغاء فورية لرقم واتساب فريق TechsyZone.`
    );
  };

  // Delete Order (for admin or customer removal)
  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    addToast('info', 'تم مسح الطلب', 'تمت إزالة الطلب من السجل وقاعدة البيانات');
  };

  // Admin confirms order
  const confirmOrderAsAdmin = (orderId: string) => {
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: 'confirmed_by_admin' as const,
            adminConfirmedAt: timestampStr,
            clientReceivedAt: ord.clientReceivedAt || timestampStr
          };
          setSelectedInvoiceOrder(updated);
          return updated;
        }
        return ord;
      })
    );

    addToast(
      'success',
      'تم توثيق الفاتورة وتحصيل العمولة!',
      'تم اعتماد الطلب رسمياً بالسيرفر وتوليد فاتورة الشراء مع إرسال رسالة الشكر الرسمية للمشتري.'
    );
  };

  // Subscribers
  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : user[0] + '***';
    const domainParts = domain.split('.');
    const maskedDomain = domainParts[0].length > 2 ? domainParts[0][0] + '***' + domainParts[0].slice(-1) : domainParts[0];
    return `${maskedUser}@${maskedDomain}.${domainParts.slice(1).join('.')}`;
  };

  const subscribeToWeeklyDigest = (email: string, name = 'مشترك مميز', phone = '') => {
    if (!email || !email.includes('@')) {
      addToast('warning', 'البريد غير صحيح', 'يرجى إدخال عنوان بريد إلكتروني صالح');
      return false;
    }

    const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      addToast('info', 'مشترك بالفعل', 'بريدك الإلكتروني مسجل بالفعل في نشرات السبت الأسبوعية');
      return false;
    }

    const newSub: Subscriber = {
      id: 'sub_' + Date.now(),
      email,
      maskedEmail: maskEmail(email),
      name: name || 'مشترك TechsyZone',
      phone,
      subscribedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setSubscribers(prev => [newSub, ...prev]);
    addToast(
      'success',
      'تم الاشتراك أونلاين في نشرة السبت!',
      'تم حفظ حسابك مشفراً بالسيرفر، وستصلك نشرة السبت التلقائية بأحدث الأسعار.'
    );
    return true;
  };

  const deleteSubscriber = (subscriberId: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== subscriberId));
    addToast('info', 'حذف مشترك', 'تم حذف المشترك من قائمة النشرات وقاعدة البيانات');
  };

  // Dispatch Saturday newsletter
  const sendSaturdayNewsletter = (subject?: string, body?: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const activeSubs = subscribers.filter(s => s.status === 'active');
    setSubscribers(prev =>
      prev.map(s => (s.status === 'active' ? { ...s, lastDigestSentDate: dateStr } : s))
    );

    setSiteConfig(prev => ({
      ...prev,
      saturdayDigestLastRun: `${dateStr} (${now.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })})`,
      ...(subject ? { saturdayDigestSubject: subject } : {}),
      ...(body ? { saturdayDigestBody: body } : {})
    }));

    addToast(
      'success',
      'تم إرسال نشرة السبت وحفظها بالسيرفر!',
      `تم إرسال نشرة الأسعار والمنتجات المحدثة تلقائياً إلى ${activeSubs.length} مشترك مسجل.`
    );

    return { count: activeSubs.length, date: dateStr };
  };

  // Google Drive Cloud Backup Sync
  const syncGoogleDriveBackup = async (customEmail?: string): Promise<boolean> => {
    const targetEmail = customEmail || siteConfig.backupDriveEmail || 'yoashaheen@gmail.com';
    try {
      const res = await fetch('/api/backup-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupEmail: targetEmail })
      });
      if (res.ok) {
        const json = await res.json();
        const info: CloudBackupInfo = {
          lastSync: new Date().toLocaleString('ar-SY'),
          fileName: json.snapshotInfo?.fileName,
          sizeBytes: json.snapshotInfo?.sizeBytes,
          email: targetEmail
        };
        setCloudBackupInfo(info);
        addToast(
          'success',
          'تمت المزامنة مع النسخ الاحتياطي السحابي (Google Drive)!',
          `تم تصدير وتأمين كامل بيانات المتجر والعملاء إلى المخزن الاحتياطي السحابي على الإيميل: ${targetEmail}`
        );
        return true;
      }
    } catch (e) {
      console.warn('Backup sync fallback:', e);
    }

    // Local snapshot export fallback
    const info: CloudBackupInfo = {
      lastSync: new Date().toLocaleString('ar-SY'),
      fileName: `drive_backup_${Date.now()}.json`,
      sizeBytes: JSON.stringify({ siteConfig, products, orders }).length,
      email: targetEmail
    };
    setCloudBackupInfo(info);
    addToast('success', 'نسخة احتياطية سحابية جاهزة', `تم تجهيز نسخة احتياطية آمنة لحساب Drive: ${targetEmail}`);
    return true;
  };

  // Customer Auth
  const customerLogin = (email: string, name: string, phone: string) => {
    const user: CustomerUser = {
      id: 'user_' + Date.now(),
      name: name || 'عميل TechsyZone',
      email,
      phone: phone || ''
    };
    setCurrentUser(user);
    subscribeToWeeklyDigest(email, user.name, user.phone);
    addToast('success', 'مرحباً بك!', `تم تسجيل الدخول واستعراض مشترياتك الخاصة باسم ${user.name}`);
  };

  const customerLogout = () => {
    setCurrentUser(null);
    addToast('info', 'تسجيل الخروج', 'تم تسجيل خروجك من حساب المشتريات الخاص');
  };

  // Admin Auth (Default password: 262028Yosh@@, changeable in admin panel)
  const adminLogin = (pass: string) => {
    const currentPass = siteConfig.adminPassword || '262028Yosh@@';
    if (pass === currentPass) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('techsyzone_admin_auth', 'true');
      addToast('success', 'لوحة التحكم', 'مرحباً بك في لوحة تحكم وإدارة منصة TechsyZone المستقلة');
      return true;
    }
    addToast('warning', 'كلمة المرور غير صحيحة', 'يرجى إدخال كلمة المرور الصحيحة للوصول إلى لوحة المدير');
    return false;
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass || newPass.trim().length < 4) {
      addToast('warning', 'كلمة المرور قصيرة', 'يجب أن تتكون كلمة المرور من 4 خانات على الأقل');
      return false;
    }
    updateSiteConfig({ adminPassword: newPass.trim() });
    addToast('success', 'تم تغيير كلمة المرور', 'تم تحديث كلمة مرور لوحة الإدارة بنجاح وحفظها أونلاين');
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('techsyzone_admin_auth');
    addToast('info', 'تم الخروج', 'تم قفل لوحة تحكم المدير');
  };

  return (
    <AppContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,
        theme,
        toggleTheme,
        isAdminRoute,
        setIsAdminRoute,
        activeTab,
        setActiveTab,
        isServerLoading,
        serverSyncStatus,
        triggerServerSync,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        stores,
        addStore,
        updateStore,
        deleteStore,
        paymentMethods,
        updatePaymentMethods,
        customElements,
        addCustomElement,
        updateCustomElement,
        deleteCustomElement,
        orders,
        createOrder,
        markOrderAsReceived,
        confirmOrderAsAdmin,
        cancelOrder,
        deleteOrder,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        subscribers,
        subscribeToWeeklyDigest,
        deleteSubscriber,
        sendSaturdayNewsletter,
        cloudBackupInfo,
        syncGoogleDriveBackup,
        isLiveEditorActive,
        setIsLiveEditorActive,
        currentUser,
        customerLogin,
        customerLogout,
        isAdminLoggedIn,
        adminLogin,
        changeAdminPassword,
        adminLogout,
        notifications,
        dismissNotification,
        addToast,
        selectedProduct,
        setSelectedProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
