import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  CATEGORY_LABELS,
  formatPersianNumber,
  formatToman,
  HARDWARE_PRODUCTS,
} from '../data/products';
import { useStore } from '../context/StoreContext';
import { HardwareCategory } from '../types/hardware';
import { HardwareImage } from './HardwareImage';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

const CATEGORY_ORDER: (HardwareCategory | 'all')[] = [
  'all',
  'gpu',
  'cpu',
  'motherboard',
  'ram',
  'ssd',
  'cooler',
  'psu',
];

export function ProductCatalog() {
  const { openProductDetail, addToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<HardwareCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = HARDWARE_PRODUCTS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.shortSpecs.toLowerCase().includes(q) ||
        item.categoryLabel.includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Section Header & Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-2">
            کاتالوگ قطعات سخت‌افزاری · موجودی آماده ارسال
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111315] [text-wrap:balance]">
            انتخاب قطعات بر اساس نیاز مهندسی شما
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی مدل، برند یا کد قطعه..."
              aria-label="جستجوی قطعات"
              className="w-full h-11 pr-10 pl-4 bg-white border border-neutral-300 rounded-lg text-sm text-[#111315] placeholder:text-neutral-400 focus:outline-none focus:border-[#1E40AF] transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="مرتب‌سازی محصولات"
            className="h-11 px-4 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-[#111315] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
          >
            <option value="featured">پیشنهاد ویژه فروشگاه</option>
            <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
            <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
          </select>
        </div>
      </div>

      {/* Segmented Category Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-neutral-200">
        {CATEGORY_ORDER.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 min-h-[40px] rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                active
                  ? 'bg-[#111315] text-white'
                  : 'bg-transparent text-neutral-600 hover:bg-neutral-200/70 hover:text-[#111315]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
        <span className="mr-auto text-xs text-neutral-500 tabular-nums whitespace-nowrap shrink-0 px-2">
          {formatPersianNumber(filteredProducts.length)} قطعه
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <p className="text-base font-semibold text-[#111315] mb-2">
            قطعه‌ای با این مشخصات یافت نشد
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            فیلتر دسته‌بندی یا عبارت جستجو را تغییر دهید تا سایر قطعات نمایش داده شوند.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#111315] text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            نمایش همه قطعات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* 4:3 Neutral Studio Media */}
              <button
                type="button"
                onClick={() => openProductDetail(product.id)}
                className="relative aspect-[4/3] w-full bg-[#EFEFEA] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1E40AF]"
              >
                <HardwareImage
                  src={product.image}
                  alt={product.title}
                  title={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>

              {/* Card Body (Strict Identical Field Order) */}
              <div className="p-5 flex-1 flex flex-col">
                {/* 1. Unboxed Metadata */}
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-neutral-700">{product.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.categoryLabel}</span>
                  </div>
                  <span className="tabular-nums text-neutral-500 shrink-0">
                    موجودی: {formatPersianNumber(product.stockCount)}
                  </span>
                </div>

                {/* 2. Product Title */}
                <h3 className="text-base font-semibold text-[#111315] leading-snug mb-2 line-clamp-2">
                  <button
                    type="button"
                    onClick={() => openProductDetail(product.id)}
                    className="text-right hover:text-[#1E40AF] transition-colors cursor-pointer"
                  >
                    {product.title}
                  </button>
                </h3>

                {/* 3. Technical Key Spec Line */}
                <p
                  dir="ltr"
                  className="font-mono text-xs text-neutral-500 text-right mb-5 truncate"
                >
                  {product.shortSpecs}
                </p>

                {/* 4. Price & Primary Quick Action */}
                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <div>
                    {product.originalPrice && (
                      <div className="text-xs text-neutral-400 line-through tabular-nums">
                        {formatToman(product.originalPrice)}
                      </div>
                    )}
                    <div className="text-[15px] font-bold text-[#111315] tabular-nums">
                      {formatToman(product.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void addToCart(product.id, 1, product.variants[0]?.id, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن به سبد</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
