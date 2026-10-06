export type ProductCategory = 
  | 'laptops_gaming'
  | 'laptops_business'
  | 'laptops_ultrabook'
  | 'desktops_gaming'
  | 'desktops_workstation'
  | 'monitors'
  | 'hardware_gpu'
  | 'hardware_cpu'
  | 'hardware_ram_ssd'
  | 'accessories';

export interface ProductSpecs {
  processor?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  condition?: 'جديد بالكرتون' | 'مجدد معتمد (فحص كامل)' | 'مستعمل بحالة الوكالة';
  warranty?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in USD $
  originalStorePrice: number; // Same as price to prove 0% markup
  storeId: string;
  storeName: string;
  storeLocation: string;
  specs: ProductSpecs;
  inStock: boolean;
  image: string;
  badge?: string; // e.g. "الأكثر طلباً", "موصى به", "عرض حصري"
  commissionAmount: number; // in USD $, deducted from store profit
  commissionRatePercent?: number; // e.g. 5%
  description: string;
  featured?: boolean;
}

export interface PartnerStore {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  rating: number;
  activeItemsCount: number;
  description: string;
  verified: boolean;
  joinedYear: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerPhone: string; // WhatsApp
  customerEmail: string;
  productId: string;
  productName: string;
  productPrice: number; // USD
  storeId: string;
  storeName: string;
  commissionAmount: number; // USD deducted from store
  orderDate: string; // YYYY-MM-DD
  orderTime: string; // HH:MM
  status: 'pending' | 'received_by_client' | 'confirmed_by_admin' | 'cancelled';
  clientReceivedAt?: string;
  adminConfirmedAt?: string;
  notes?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  maskedEmail: string;
  name: string;
  phone?: string;
  subscribedDate: string;
  lastDigestSentDate?: string;
  status: 'active' | 'unsubscribed';
}

export interface PaymentMethod {
  id: string;
  title: string;
  shortDesc: string;
  iconType: 'bank' | 'cash' | 'crypto' | 'wallet';
  details: string[];
  active: boolean;
}

export interface CustomBuilderElement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  actionType: 'external_url' | 'scroll_to' | 'show_modal' | 'copy_text';
  actionTarget: string; // url, element id, modal name, or text
  buttonText: string;
  location: 'hero_announcement' | 'features_grid' | 'bottom_banner';
  enabled: boolean;
}

export interface SiteConfig {
  brandName: string;
  brandSubtitle: string;
  logoUrl: string;
  faviconUrl?: string;
  splashScreenEnabled: boolean;
  splashDurationSec: number;
  
  // Contacts & Social
  whatsAppNumber: string; // e.g. +963987654321
  messengerUrl: string; // e.g. https://m.me/techsyzone
  facebookPageUrl: string; // e.g. https://facebook.com/techsyzone
  instagramPageUrl: string; // e.g. https://instagram.com/techsyzone
  adminNotificationEmail: string; // for receiving invoice alerts
  
  // Theme & Appearance
  primaryColor: 'cyan' | 'emerald' | 'blue' | 'purple' | 'amber';
  fontFamily: 'Cairo' | 'Tajawal' | 'Alexandria' | 'IBM Plex Sans Arabic';
  defaultTheme: 'dark' | 'light';
  
  // Announcements & Banner
  announcementText: string;
  announcementActive: boolean;
  
  // Static content & Policies
  brokerageExplanation: string;
  zeroCommissionStatement: string;
  privacyPolicy: string;
  
  // Google Drive Cloud Backup
  backupDriveEmail: string; // email for Google Drive reserve backup storage
  
  // Customizable Live Editor Text Elements
  heroMainTitle?: string;
  heroMainSubtitle?: string;
  heroMainDescription?: string;
  liveEditorActive?: boolean;

  // Admin Authentication
  adminPassword?: string;

  // Saturday Newsletter
  saturdayDigestSubject: string;
  saturdayDigestBody: string;
  saturdayDigestLastRun?: string;
}
