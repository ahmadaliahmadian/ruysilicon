import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import {
  formatPersianNumber,
  formatToman,
  getProductById,
  getProductEffectivePrice,
} from '../data/products';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, ShippingMethod } from '../types/hardware';

export function CheckoutView() {
  const {
    user,
    profile,
    signInWithGoogle,
    saveProfile,
    cartItems,
    cartSubtotal,
    promoCode,
    discountRate,
    placeOrder,
    lastConfirmedOrder,
    setLastConfirmedOrder,
    setActiveView,
    notify,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || user?.displayName || '');
      setPhone(profile.phone || '');
      setProvince(profile.province || 'تهران');
      setCity(profile.city || 'تهران');
      setAddress(profile.address || '');
      setPostalCode(profile.postalCode || '');
    } else if (user) {
      setFullName(user.displayName || '');
    }
  }, [profile, user]);

  // Confirmation Receipt State
  if (lastConfirmedOrder) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 sm:p-10 space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-neutral-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 mb-1">
                تایید پرداخت و ثبت موفق سفارش
              </p>
              <h1 className="text-2xl font-bold text-[#111315]">
                سفارش {lastConfirmedOrder.orderNumber} با موفقیت ثبت شد
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                همکاران بخش کنترل کیفی ما آماده‌سازی و بسته‌بندی قطعات را آغاز کرده‌اند.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-[#F6F6F4]">
              <dt className="text-xs text-neutral-500 mb-1">تحویل‌گیرنده</dt>
              <dd className="font-semibold text-[#111315]">{lastConfirmedOrder.customerName}</dd>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F6F4]">
              <dt className="text-xs text-neutral-500 mb-1">شماره تماس</dt>
              <dd dir="ltr" className="font-mono font-semibold text-[#111315] text-right">
                {lastConfirmedOrder.customerPhone}
              </dd>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F6F4] sm:col-span-2">
              <dt className="text-xs text-neutral-500 mb-1">نشانی ارسال</dt>
              <dd className="font-medium text-[#111315]">{lastConfirmedOrder.shippingAddress}</dd>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F6F4]">
              <dt className="text-xs text-neutral-500 mb-1">اقلام سفارش</dt>
              <dd className="font-medium text-[#111315] leading-relaxed">
                {lastConfirmedOrder.itemsSummary}
              </dd>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F6F4]">
              <dt className="text-xs text-neutral-500 mb-1">مبلغ کل پرداخت‌شده</dt>
              <dd className="text-lg font-bold text-[#1E40AF] tabular-nums">
                {formatToman(lastConfirmedOrder.totalAmount)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setLastConfirmedOrder(null);
                setActiveView('orders');
              }}
              className="px-6 py-3 bg-[#111315] hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              مشاهده و پیگیری در سفارش‌های من
            </button>
            <button
              type="button"
              onClick={() => {
                setLastConfirmedOrder(null);
                setActiveView('store');
              }}
              className="px-5 py-3 border border-neutral-300 hover:border-[#111315] text-[#111315] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white border border-neutral-200 rounded-xl p-10">
          <h1 className="text-xl font-bold text-[#111315] mb-2">سبد خرید شما خالی است</h1>
          <p className="text-sm text-neutral-600 mb-6">
            برای ثبت سفارش ابتدا قطعات مورد نیاز خود را به سبد خرید اضافه کنید.
          </p>
          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="px-6 py-3 bg-[#1E40AF] text-white text-sm font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            مشاهده فروشگاه قطعات
          </button>
        </div>
      </section>
    );
  }

  const discountAmount = Math.round(cartSubtotal * discountRate);
  const freeShippingEligible = cartSubtotal >= 20000000;
  const shippingCost =
    shippingMethod === 'pickup'
      ? 0
      : freeShippingEligible
        ? 0
        : shippingMethod === 'express'
          ? 250000
          : 180000;
  const totalPayable = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (fullName.trim().length < 2) {
      notify('لطفاً نام و نام خانوادگی تحویل‌گیرنده را وارد کنید.', 'error');
      return;
    }
    if (phone.trim().length < 8) {
      notify('لطفاً شماره موبایل معتبر وارد کنید.', 'error');
      return;
    }
    if (address.trim().length < 5) {
      notify('لطفاً نشانی دقیق ارسال را وارد کنید.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await saveProfile({
        fullName,
        phone,
        province,
        city,
        address,
        postalCode,
      });

      const fullShippingAddress = `${province}، ${city}، ${address}${
        postalCode ? ` (کد پستی: ${postalCode})` : ''
      }`;

      await placeOrder({
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: fullShippingAddress,
        shippingMethod,
        paymentMethod,
        discountCode: promoCode,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <button
        type="button"
        onClick={() => setActiveView('store')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#111315] mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به فروشگاه</span>
      </button>

      {/* Checkout Progress Header */}
      <div className="mb-8 pb-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111315]">
            ثبت‌نام، تکمیل نشانی و پرداخت سفارش
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            تمامی سفارش‌ها همراه با فاکتور رسمی و ضمانت‌نامه معتبر ارسال می‌شوند.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
          <span className={user ? 'text-emerald-700' : 'text-[#1E40AF]'}>
            ۱. حساب کاربری
          </span>
          <span aria-hidden="true">/</span>
          <span className={user ? 'text-[#1E40AF]' : ''}>۲. نشانی ارسال</span>
          <span aria-hidden="true">/</span>
          <span>۳. پرداخت نهایی</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Authentication */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-[#1E40AF]" />
                <h2 className="text-base font-bold text-[#111315]">۱. احراز هویت و حساب کاربری</h2>
              </div>
              {user && (
                <span className="text-xs font-semibold text-emerald-700">تایید شده</span>
              )}
            </div>

            {user ? (
              <p className="text-sm text-neutral-700">
                وارد شده با حساب <span dir="ltr" className="font-mono font-semibold">{user.email}</span>
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-sm text-neutral-600">
                  برای ثبت سفارش دائمی و پیگیری لحظه‌ای وضعیت مرسوله، با حساب گوگل خود وارد شوید.
                </p>
                <button
                  type="button"
                  onClick={() => void signInWithGoogle()}
                  className="px-5 py-2.5 bg-[#111315] hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  ورود / ثبت‌نام با گوگل
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Registration / Shipping Info */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#1E40AF]" />
              <h2 className="text-base font-bold text-[#111315]">۲. مشخصات تحویل‌گیرنده و نشانی</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثلاً: آرش محمدی"
                  className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm text-right font-mono focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">استان</label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">شهر</label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  نشانی دقیق پستی
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={300}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="خیابان، کوچه، پلاک، طبقه و واحد"
                  className="w-full p-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  کد پستی ۱۰ رقمی
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={20}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1415512345"
                  className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm text-right font-mono focus:outline-none focus:border-[#1E40AF]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shipping & Payment */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Truck className="w-5 h-5 text-[#1E40AF]" />
                <h2 className="text-base font-bold text-[#111315]">۳. روش ارسال مرسوله</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'express' as ShippingMethod,
                    title: 'ارسال اکسپرس ویژه',
                    desc: 'تحویل ۲۴ ساعته با بیمه کامل',
                    cost: freeShippingEligible ? 'رایگان' : formatToman(250000),
                  },
                  {
                    id: 'post' as ShippingMethod,
                    title: 'پست پیشتاز بیمه‌شده',
                    desc: 'سراسر کشور (۲ تا ۴ روز کاری)',
                    cost: freeShippingEligible ? 'رایگان' : formatToman(180000),
                  },
                  {
                    id: 'pickup' as ShippingMethod,
                    title: 'تحویل حضوری',
                    desc: 'مرکز سخت‌افزار تهران',
                    cost: 'رایگان',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setShippingMethod(opt.id)}
                    className={`p-4 rounded-lg border text-right transition-colors cursor-pointer ${
                      shippingMethod === opt.id
                        ? 'border-[#1E40AF] bg-blue-50/40'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#111315]">{opt.title}</div>
                    <div className="text-xs text-neutral-500 mt-1">{opt.desc}</div>
                    <div className="text-xs font-bold text-[#1E40AF] mt-2 tabular-nums">
                      {opt.cost}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-neutral-100">
              <div className="flex items-center gap-2.5 mb-4">
                <CreditCard className="w-5 h-5 text-[#1E40AF]" />
                <h2 className="text-base font-bold text-[#111315]">۴. شیوه پرداخت</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-lg border text-right transition-colors cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'border-[#1E40AF] bg-blue-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#111315]">پرداخت آنلاین شتابی</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    تایید آنی سفارش و اولویت در تست فنی و ارسال
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-lg border text-right transition-colors cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#1E40AF] bg-blue-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#111315]">پرداخت در محل (تهران)</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    تسویه با کارت‌خوان هنگام تحویل بسته درب منزل
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Order Summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-[#111315]">خلاصه فاکتور سفارش</h2>

          <ul className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
            {cartItems.map((entry) => {
              const prod = getProductById(entry.productId);
              if (!prod) return null;
              const unit = getProductEffectivePrice(prod, entry.variantId);
              return (
                <li key={entry.productId} className="py-3 flex justify-between gap-3 text-xs">
                  <span className="text-neutral-700 font-medium line-clamp-2">
                    {prod.title} × {formatPersianNumber(entry.quantity)}
                  </span>
                  <span className="font-semibold text-[#111315] tabular-nums shrink-0">
                    {formatToman(unit * entry.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>مبلغ کالاها</span>
              <span className="tabular-nums">{formatToman(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>تخفیف ({promoCode})</span>
                <span className="tabular-nums">-{formatToman(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>هزینه ارسال و بیمه</span>
              <span className="tabular-nums">
                {shippingCost === 0 ? 'رایگان' : formatToman(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#111315] pt-3 border-t border-neutral-200">
              <span>مبلغ نهایی</span>
              <span className="tabular-nums text-[#1E40AF]">{formatToman(totalPayable)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {!user
              ? 'ورود با گوگل و ادامه خرید'
              : submitting
                ? 'در حال ثبت نهایی سفارش...'
                : 'تایید و ثبت نهایی سفارش'}
          </button>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>ضمانت بازگشت ۷ روزه در صورت عدم بازشدن پلمپ</span>
          </div>
        </aside>
      </form>
    </section>
  );
}
