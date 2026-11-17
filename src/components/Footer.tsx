import { useStore } from '../context/StoreContext';

export function Footer() {
  const { setActiveView, setIsCartOpen } = useStore();

  const navigate = (view: 'store' | 'builder' | 'orders' | 'account') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111315] text-neutral-400 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          <div className="md:col-span-2 space-y-3">
            <div className="text-lg font-bold text-white">رایاسلیکون</div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              فروشگاه تخصصی قطعات کامپیوتر، تجهیزات ورک‌استیشن و سیستم‌های مهندسی با تضمین اصالت و
              مشاوره فنی اسمبل.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('store')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  کاتالوگ قطعات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('builder')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  اسمبل هوشمند سیستم
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('orders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  پیگیری سفارش‌ها
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  سبد خرید
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white">ارتباط و پشتیبانی</h3>
            <div className="space-y-2 text-sm">
              <p>تهران، تقاطع ولیعصر و طالقانی، مرکز فناوری رایا</p>
              <p dir="ltr" className="font-mono text-right">
                021-88904410
              </p>
              <p>پاسخگویی فنی: شنبه تا پنج‌شنبه ۹ تا ۱۹</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>© ۱۴۰۵ رایاسلیکون — تمامی حقوق محفوظ است.</span>
          <span>کد تخفیف فعال مشتریان: RAYA10</span>
        </div>
      </div>
    </footer>
  );
}
