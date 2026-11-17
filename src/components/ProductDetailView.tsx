import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  formatPersianNumber,
  formatToman,
  getProductById,
  getProductEffectivePrice,
} from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductReviewRecord } from '../types/hardware';
import { HardwareImage } from './HardwareImage';

export function ProductDetailView() {
  const {
    selectedProductId,
    setActiveView,
    addToCart,
    user,
    profile,
    signInWithGoogle,
    notify,
  } = useStore();

  const product = selectedProductId ? getProductById(selectedProductId) : undefined;
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState<ProductReviewRecord[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setReviewsLoading(true);
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', product.id)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ProductReviewRecord[] = snap.docs
          .map((d) => {
            const data = d.data();
            const createdMillis =
              data.createdAt && typeof data.createdAt.toMillis === 'function'
                ? data.createdAt.toMillis()
                : Date.now();
            return {
              id: d.id,
              productId: String(data.productId || product.id),
              userId: String(data.userId || ''),
              authorName: String(data.authorName || 'کاربر'),
              rating: Number(data.rating || 5),
              comment: String(data.comment || ''),
              createdAtMs: createdMillis,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setReviews(list);
        setReviewsLoading(false);
      },
      (error) => {
        setReviewsLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'reviews');
      }
    );

    return () => unsub();
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-base font-semibold text-[#111315] mb-4">محصول مورد نظر یافت نشد.</p>
        <button
          type="button"
          onClick={() => setActiveView('store')}
          className="px-5 py-2.5 bg-[#111315] text-white text-sm font-semibold rounded-lg cursor-pointer"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  const effectivePrice = getProductEffectivePrice(product, selectedVariantId);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await signInWithGoogle();
      return;
    }
    const trimmed = commentInput.trim();
    if (trimmed.length < 3) {
      notify('لطفاً دیدگاه خود را با حداقل ۳ کاراکتر بنویسید.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: product.id,
        userId: user.uid,
        authorName: (profile?.fullName || user.displayName || 'خریدار رایاسلیکون').slice(0, 80),
        rating: Math.min(5, Math.max(1, Math.round(ratingInput))),
        comment: trimmed.slice(0, 600),
        createdAt: serverTimestamp(),
      });
      setCommentInput('');
      setRatingInput(5);
      notify('دیدگاه شما با موفقیت ثبت شد.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      notify('دیدگاه حذف شد.', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb Back Navigation */}
      <button
        type="button"
        onClick={() => setActiveView('store')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#111315] mb-8 transition-colors cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به کاتالوگ قطعات</span>
      </button>

      {/* Main Contiguous 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sticky Gallery & Technical Specs Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#EFEFEA] border border-neutral-200">
            <HardwareImage
              src={product.image}
              alt={product.title}
              title={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Engineering Description */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#111315] mb-3">معرفی فنی قطعه</h2>
            <p className="text-[15px] text-neutral-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Technical Specification Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold text-[#111315]">مشخصات مهندسی و فنی</h2>
            </div>
            <dl className="divide-y divide-neutral-100">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                >
                  <dt className="text-sm font-semibold text-neutral-600">{spec.label}</dt>
                  <dd
                    dir="ltr"
                    className="sm:col-span-2 text-sm font-mono tabular-nums text-[#111315] sm:text-left"
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Sticky Contiguous Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <span className="font-semibold text-neutral-800">{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono" dir="ltr">
                  {product.sku}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#111315] leading-snug [text-wrap:balance]">
                {product.title}
              </h1>
            </div>

            {/* Availability & Warranty */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-sm">
              <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  موجود در انبار ({formatPersianNumber(product.stockCount)} عدد آماده ارسال)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#1E40AF] shrink-0" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-700">
                <Truck className="w-4 h-4 text-[#1E40AF] shrink-0" />
                <span>ارسال رایگان برای خرید بالای ۲۰ میلیون تومان</span>
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-600">
                  انتخاب نسخه و پیکربندی:
                </span>
                <div className="space-y-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`w-full text-right px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#1E40AF] bg-blue-50/40 text-[#111315]'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <span>{variant.label}</span>
                        <span className="font-mono tabular-nums text-xs text-neutral-600 shrink-0">
                          {variant.priceDelta === 0
                            ? 'پایه'
                            : variant.priceDelta > 0
                              ? `+${formatToman(variant.priceDelta)}`
                              : formatToman(variant.priceDelta)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price & Quantity Stepper */}
            <div className="pt-4 border-t border-neutral-100 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-neutral-500">قیمت نهایی:</span>
                <div className="text-left">
                  {product.originalPrice && (
                    <div className="text-xs text-neutral-400 line-through tabular-nums">
                      {formatToman(product.originalPrice)}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-[#111315] tabular-nums">
                    {formatToman(effectivePrice * quantity)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-neutral-300 rounded-lg bg-[#F6F6F4]">
                  <button
                    type="button"
                    aria-label="افزایش تعداد"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#111315] hover:bg-neutral-200/70 rounded-r-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono tabular-nums text-sm font-semibold">
                    {formatPersianNumber(quantity)}
                  </span>
                  <button
                    type="button"
                    aria-label="کاهش تعداد"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#111315] hover:bg-neutral-200/70 rounded-l-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => void addToCart(product.id, quantity, selectedVariantId, true)}
                  className="flex-1 h-11 px-6 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section (Firestore-Backed) */}
      <section className="mt-12 pt-10 border-t border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <h2 className="text-xl font-bold text-[#111315] mb-2">ثبت دیدگاه تخصصی</h2>
          <p className="text-sm text-neutral-600 mb-6">
            تجربه خود از عملکرد حرارتی، پایداری یا اسمبل این قطعه را با سایر خریداران به اشتراک بگذارید.
          </p>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
          >
            <div>
              <span className="block text-xs font-semibold text-neutral-600 mb-2">امتیاز شما:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`امتیاز ${star}`}
                    onClick={() => setRatingInput(star)}
                    className="p-1.5 rounded-md hover:bg-neutral-100 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= ratingInput
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="block text-xs font-semibold text-neutral-600 mb-2"
              >
                متن دیدگاه
              </label>
              <textarea
                id="review-comment"
                rows={4}
                maxLength={600}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="نظرتان درباره کیفیت ساخت، دما و کارایی قطعه..."
                className="w-full p-3 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm text-[#111315] focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full h-11 bg-[#111315] hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {user
                ? submittingReview
                  ? 'در حال ثبت...'
                  : 'ثبت دیدگاه'
                : 'ورود با گوگل برای ثبت دیدگاه'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111315]">دیدگاه کاربران</h2>
            <span className="text-xs text-neutral-500 tabular-nums">
              {formatPersianNumber(reviews.length)} دیدگاه ثبت‌شده
            </span>
          </div>

          {reviewsLoading ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-500">
              در حال بارگذاری دیدگاه‌ها...
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-500">
              هنوز دیدگاهی برای این قطعه ثبت نشده است. اولین نفری باشید که تجربه خود را می‌نویسد.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm">
                      <span className="font-semibold text-[#111315]">{rev.authorName}</span>
                      <span aria-hidden="true" className="text-neutral-300">
                        ·
                      </span>
                      <span className="text-xs text-neutral-500 tabular-nums">
                        {new Date(rev.createdAtMs).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5" aria-label={`امتیاز ${rev.rating} از ۵`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      {user?.uid === rev.userId && (
                        <button
                          type="button"
                          onClick={() => void handleDeleteReview(rev.id)}
                          aria-label="حذف دیدگاه"
                          className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{rev.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
