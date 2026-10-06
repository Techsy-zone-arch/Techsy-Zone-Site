import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { 
  SlidersHorizontal, 
  Search, 
  MessageCircle, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Store, 
  ArrowUpDown,
  CheckCircle,
  Eye,
  PlusCircle,
  Info
} from 'lucide-react';

interface ProductCatalogProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenQuickOrder: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenQuickOrder
}) => {
  const { products, stores, siteConfig, setSelectedProduct, theme } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'كافة الأجهزة والقطع' },
    { id: 'laptops_gaming', label: 'لابتوبات قيمنق' },
    { id: 'laptops_business', label: 'لابتوبات أعمال وألترا' },
    { id: 'desktops_gaming', label: 'حواسيب تجميع قيمنق' },
    { id: 'desktops_workstation', label: 'محطات عمل هندسية' },
    { id: 'monitors', label: 'شاشات عرض احترافية' },
    { id: 'hardware_gpu', label: 'كروت شاشة وهاردوير' },
    { id: 'accessories', label: 'ملحقات واكسسوارات' },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Store match
      if (selectedStore !== 'all' && item.storeId !== selectedStore) {
        return false;
      }

      // Condition match
      if (selectedCondition !== 'all') {
        if (item.specs.condition !== selectedCondition) {
          return false;
        }
      }

      // Price match
      if (item.price < minPrice || item.price > maxPrice) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchStore = item.storeName?.toLowerCase().includes(query);
        const matchCpu = item.specs.processor?.toLowerCase().includes(query);
        const matchGpu = item.specs.gpu?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchStore && !matchCpu && !matchGpu) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0; // default newest
    });
  }, [products, selectedCategory, selectedStore, selectedCondition, minPrice, maxPrice, searchQuery, sortBy]);

  // Handle WhatsApp Order Direct link
  const handleWhatsAppOrder = (product: Product) => {
    const cleanNumber = siteConfig.whatsAppNumber.replace(/[^0-9]/g, '');
    const text = `مرحباً TechsyZone،
أرغب بطلب الجهاز التالي عبر وساطتكم المعتمدة:
• اسم الجهاز: ${product.name}
• السعر: $${product.price}
• المتجر المعتمد: ${product.storeName}
• المواصفات: ${product.specs.processor || ''} / ${product.specs.gpu || ''}
أرجو تأكيد التوفر وترتيب الفحص والاستلام.`;
    
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Handle Messenger Order Direct link
  const handleMessengerOrder = (product: Product) => {
    window.open(siteConfig.messengerUrl, '_blank');
  };

  return (
    <section id="catalog-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700 font-bold'
          }`}>
            <Store className="w-4 h-4" />
            <span>كتالوج الأجهزة والقطع المتوفرة</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            اختر جهازك بالسعر الحقيقي المعتمد
          </h2>
          <p className={`text-sm mt-1 font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            جميع الأسعار مطابقة لمتاجرها بالدولار ($) مع ضمان فحص القطع والكفالة الرسمية.
          </p>
        </div>

        {/* Quick Stats or Filter Drawer Toggle on Mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`md:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
            <span>فلترة متقدمة</span>
          </button>

          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-300'
              : 'bg-white border-slate-300 text-slate-800 shadow-sm'
          }`}>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
              }`}
            >
              <option value="newest" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>الأحدث توفراً</option>
              <option value="price_asc" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>السعر: من الأقل للأعلى</option>
              <option value="price_desc" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs (Segmented Buttons) */}
      <div className="pt-6 pb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'dark'
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filter Toolbar (Desktop & Mobile Drawer) */}
      <div className={`p-4 rounded-2xl border mb-8 transition-colors ${
        theme === 'dark' 
          ? 'bg-slate-900/80 border-slate-800/80' 
          : 'bg-white border-slate-200 shadow-sm'
      } ${showFilterDrawer ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Store Filter */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-800'
            }`}>المتجر الشريك</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-950'
              }`}
            >
              <option value="all">كافة المتاجر المعتمدة</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-800'
            }`}>حالة الجهاز</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-950'
              }`}
            >
              <option value="all">كافة الحالات</option>
              <option value="جديد بالكرتون">جديد بالكرتون (مغلف)</option>
              <option value="مجدد معتمد (فحص كامل)">مجدد معتمد (فحص كامل)</option>
              <option value="مستعمل بحالة الوكالة">مستعمل بحالة الوكالة</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="sm:col-span-2">
            <div className={`flex items-center justify-between text-xs font-bold mb-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-800'
            }`}>
              <span>نطاق السعر بالدولار ($):</span>
              <span className={`font-mono font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              }`}>${minPrice} - ${maxPrice}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max={maxPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                placeholder="من $"
                className={`w-24 border rounded-lg px-2.5 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-300 text-slate-950'
                }`}
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-cyan-500 cursor-pointer"
              />
              <input
                type="number"
                min={minPrice}
                max="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || 5000)}
                placeholder="إلى $"
                className={`w-24 border rounded-lg px-2.5 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-cyan-500 ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-700 text-slate-200'
                    : 'bg-slate-50 border-slate-300 text-slate-950'
                }`}
              />
            </div>
          </div>

        </div>

        {/* Reset active filters button if any applied */}
        {(selectedCategory !== 'all' || selectedStore !== 'all' || selectedCondition !== 'all' || minPrice > 0 || maxPrice < 5000 || searchQuery) && (
          <div className={`pt-3 mt-3 border-t flex items-center justify-between text-xs font-semibold ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-700'
          }`}>
            <span>تم تصفية {filteredProducts.length} من أصل {products.length} جهاز</span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStore('all');
                setSelectedCondition('all');
                setMinPrice(0);
                setMaxPrice(5000);
                setSearchQuery('');
              }}
              className="text-cyan-500 hover:underline font-bold cursor-pointer"
            >
              إلغاء كافة الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          theme === 'dark'
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Info className="w-10 h-10 text-cyan-500 mx-auto mb-3 opacity-70" />
          <h3 className={`text-lg font-black mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>لا توجد أجهزة مطابقة لخيارات الفلترة الحالية</h3>
          <p className={`text-sm max-w-md mx-auto mb-4 font-medium ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            جرب توسيع نطاق السعر أو تغيير تصنيف البحث، أو تواصل معنا مباشرة عبر واتساب لطلب الجهاز الذي تبحث عنه.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStore('all');
              setMinPrice(0);
              setMaxPrice(5000);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800/90 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5'
                  : 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-xl shadow-sm'
              }`}
            >
              {/* Product Visual Container */}
              <div 
                className={`relative aspect-[4/3] overflow-hidden cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
                }`} 
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Badge if present */}
                {product.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 text-[11px] font-black shadow">
                    {product.badge}
                  </div>
                )}

                {/* Price tag overlay in USD */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur border border-slate-700/80 text-white font-mono font-bold text-sm shadow">
                  <span className="text-cyan-400 font-bold">$</span>
                  <span className="text-lg tabular-nums mr-0.5">{product.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Product Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Unboxed Metadata */}
                  <div className={`flex items-center gap-2 text-xs mb-1.5 flex-wrap font-bold ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <span className={theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'}>{product.storeName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.storeLocation}</span>
                    <span aria-hidden="true">·</span>
                    <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}>{product.specs.condition || 'جديد بالكرتون'}</span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => setSelectedProduct(product)}
                    className={`text-base font-black transition-colors line-clamp-2 cursor-pointer leading-snug ${
                      theme === 'dark' 
                        ? 'text-white group-hover:text-cyan-300' 
                        : 'text-slate-950 group-hover:text-cyan-700'
                    }`}
                  >
                    {product.name}
                  </h3>

                  {/* Specs Quick Breakdown */}
                  <div className={`mt-3 grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl border ${
                    theme === 'dark'
                      ? 'text-slate-300 bg-slate-950/60 border-slate-800/80'
                      : 'text-slate-800 bg-slate-50 border-slate-200 font-medium'
                  }`}>
                    {product.specs.processor && (
                      <div className="flex items-center gap-1.5 truncate" title={product.specs.processor}>
                        <Cpu className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                        <span className="truncate">{product.specs.processor}</span>
                      </div>
                    )}
                    {product.specs.gpu && (
                      <div className="flex items-center gap-1.5 truncate" title={product.specs.gpu}>
                        <Monitor className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                        <span className="truncate">{product.specs.gpu}</span>
                      </div>
                    )}
                    {product.specs.ram && (
                      <div className="flex items-center gap-1.5 truncate" title={product.specs.ram}>
                        <HardDrive className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                        <span className="truncate">{product.specs.ram}</span>
                      </div>
                    )}
                    {product.specs.storage && (
                      <div className="flex items-center gap-1.5 truncate" title={product.specs.storage}>
                        <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                        <span className="truncate">{product.specs.storage}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zero Commission Reassurance on Card */}
                <div className={`text-[11px] flex items-center justify-between pt-1 border-t font-semibold ${
                  theme === 'dark' ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>عمولة المشتري:</span>
                  <span className={`font-black font-mono ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                  }`}>0.00$ (مخصومة من المتجر)</span>
                </div>

                {/* Action Buttons: WhatsApp Order + Messenger Order + Details */}
                <div className="space-y-2 pt-1">
                  
                  {/* Primary WhatsApp Order Button */}
                  <button
                    onClick={() => handleWhatsAppOrder(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/15 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>طلب فوري عبر الواتساب</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Messenger Order Button */}
                    <button
                      onClick={() => handleMessengerOrder(product)}
                      className={`py-2 px-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-blue-950/70 hover:bg-blue-900 border-blue-800/60 text-blue-200'
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.12 7.15.16.15.26.36.26.58l.05 2.13c.02.69.7 1.13 1.29.83l2.38-1.22c.18-.09.38-.11.58-.07.75.17 1.54.26 2.32.26 5.64 0 10-4.13 10-9.66C22 6.13 17.64 2 12 2zm1.08 12.98l-2.58-2.75-5.03 2.76 5.53-5.87 2.65 2.75 4.96-2.76-5.53 5.87z"/>
                      </svg>
                      <span className="truncate">طلب بالمسنجر</span>
                    </button>

                    {/* View Details / Order Logging */}
                    <button
                      onClick={() => onOpenQuickOrder(product)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                      }`}
                    >
                      <PlusCircle className={`w-3.5 h-3.5 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
                      <span className="truncate">تثبيت بالسجل</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
