import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  formatPersianNumber,
  formatToman,
  getProductById,
  getProductEffectivePrice,
} from '../data/products';
import { useStore } from '../context/StoreContext';
import { HardwareImage } from './HardwareImage';

const FREE_SHIPPING_THRESHOLD = 20000000;

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartCount,
    cartSubtotal,
    promoCode,
    setPromoCode,
    discountRate,
    updateCartQuantity,
    removeFromCart,
    setActiveView,
    notify,
  } = useStore();

  const [promoInput, setPromoInput] = useState(promoCode);

  if (!isCartOpen) return null;

  const discountAmount = Math.round(cartSubtotal * discountRate);
  const finalPayable = Math.max(0, cartSubtotal - discountAmount);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = () => {
    const clean = promoInput.trim().toUpperCase();
    setPromoCode(clean);
    if (clean === 'RAYA10') {
      notify('کد تخفیف ۱۰٪ رایاسلیکون اعمال شد.', 'success');
    } else if (!clean) {
      notify('کد تخفیف حذف شد.', 'info');
    } else {
      notify('کد تخفیف معتبر نیست (کد نمونه: RAYA10).', 'error');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="سبد خرید">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-Over Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col border-r border-neutral-200 shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#111315]" />
            <h2 className="text-base font-bold text-[#111315]">سبد خرید</h2>
            <span className="text-xs text-neutral-500 tabular-nums">
              ({formatPersianNumber(cartCount)} کالا)
            </span>
          </div>
          <button
            type="button"
            aria-label="بستن سبد خرید"
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cartItems.length > 0 && (
          <div className="px-6 py-3 bg-[#F6F6F4] border-b border-neutral-200 space-y-2">
            <p className="text-xs font-medium text-neutral-700">
              {freeShippingRemaining === 0
                ? 'سفارش شما مشمول ارسال رایگان بیمه‌شده است.'
                : `تنها ${formatToman(freeShippingRemaining)} تا ارسال رایگان باقی مانده است.`}
            </p>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E40AF] transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mb-3" />
              <p className="text-base font-semibold text-[#111315] mb-1">سبد خرید شما خالی است</p>
              <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                قطعات مورد نظر خود را از فروشگاه یا بخش اسمبل هوشمند انتخاب کنید.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-[#111315] text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            cartItems.map((entry) => {
              const product = getProductById(entry.productId);
              if (!product) return null;
              const unitPrice = getProductEffectivePrice(product, entry.variantId);
              return (
                <div
                  key={entry.productId}
                  className="flex gap-4 pb-5 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="w-20 h-16 rounded-lg bg-[#EFEFEA] overflow-hidden shrink-0 border border-neutral-200">
                    <HardwareImage
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#111315] leading-snug line-clamp-2">
                        {product.title}
                      </h3>
                      <button
                        type="button"
                        aria-label={`حذف ${product.title}`}
                        onClick={() => void removeFromCart(product.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                      {formatToman(unitPrice)}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-neutral-300 rounded-md">
                        <button
                          type="button"
                          aria-label="افزایش"
                          onClick={() => void updateCartQuantity(product.id, entry.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono tabular-nums text-xs font-semibold">
                          {formatPersianNumber(entry.quantity)}
                        </span>
                        <button
                          type="button"
                          aria-label="کاهش"
                          onClick={() => void updateCartQuantity(product.id, entry.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#111315] tabular-nums">
                        {formatToman(unitPrice * entry.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-[#F6F6F4] space-y-4">
            {/* Discount Code */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="کد تخفیف (نمونه: RAYA10)"
                aria-label="کد تخفیف"
                className="flex-1 h-10 px-3 bg-white border border-neutral-300 rounded-lg text-xs text-[#111315] placeholder:text-neutral-400 focus:outline-none focus:border-[#1E40AF]"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 h-10 bg-white border border-neutral-300 hover:border-[#111315] text-xs font-semibold text-[#111315] rounded-lg transition-colors cursor-pointer"
              >
                اعمال کد
              </button>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>جمع کل کالاها</span>
                <span className="tabular-nums font-medium">{formatToman(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>تخفیف کد RAYA10 (۱۰٪)</span>
                  <span className="tabular-nums font-medium">-{formatToman(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#111315] pt-2 border-t border-neutral-200">
                <span>مبلغ قابل پرداخت</span>
                <span className="tabular-nums">{formatToman(finalPayable)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedCheckout}
              className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <span>ادامه و ثبت سفارش</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
