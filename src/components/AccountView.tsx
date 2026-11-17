import React, { useEffect, useState } from 'react';
import { LogOut, Package, Save, UserCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AccountView() {
  const { user, profile, profileLoading, signInWithGoogle, signOut, saveProfile, setActiveView } =
    useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [saving, setSaving] = useState(false);

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

  if (!user) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#111315]">ثبت‌نام و ورود به حساب رایاسلیکون</h1>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            با حساب گوگل خود وارد شوید تا سبد خرید شما همگام‌سازی شود، نشانی ارسال را ذخیره کنید و
            تمامی سفارش‌های خود را به‌صورت لحظه‌ای پیگیری نمایید.
          </p>
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="px-6 py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ورود و ثبت‌نام با حساب گوگل
          </button>
        </div>
      </section>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile({
        fullName,
        phone,
        province,
        city,
        address,
        postalCode,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-1">پروفایل مشتری و اطلاعات ارسال</p>
          <h1 className="text-2xl font-bold text-[#111315]">
            {profile?.fullName || user.displayName || 'حساب کاربری'}
          </h1>
          <p dir="ltr" className="text-xs font-mono text-neutral-500 mt-1 text-right">
            {user.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('orders')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 hover:border-[#111315] text-xs font-semibold text-[#111315] rounded-lg transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>مشاهده سفارش‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-red-300 hover:text-red-700 text-xs font-semibold text-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111315]">تکمیل فرم ثبت‌نام و نشانی پیش‌فرض</h2>
          {profile?.profileCompleted ? (
            <span className="text-xs font-semibold text-emerald-700">پروفایل تکمیل شده</span>
          ) : (
            <span className="text-xs font-semibold text-amber-700">نیازمند تکمیل نشانی</span>
          )}
        </div>

        {profileLoading ? (
          <p className="text-sm text-neutral-500">در حال بارگذاری اطلاعات...</p>
        ) : (
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
                maxLength={60}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                نشانی کامل پستی
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="خیابان، کوچه، پلاک، واحد"
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
                className="w-full h-11 px-3.5 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-sm text-right font-mono focus:outline-none focus:border-[#1E40AF]"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'در حال ذخیره...' : 'ذخیره اطلاعات پروفایل'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
