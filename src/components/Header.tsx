import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { formatPersianNumber } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ActiveView } from '../types/hardware';

interface HeaderProps {
  onNavigateStoreCatalog: () => void;
}

export function Header({ onNavigateStoreCatalog }: HeaderProps) {
  const { activeView, setActiveView, cartCount, setIsCartOpen, user } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'store', label: 'فروشگاه' },
    { id: 'builder', label: 'اسمبل هوشمند' },
    { id: 'orders', label: 'سفارش‌های من' },
    { id: 'account', label: user ? 'حساب کاربری' : 'ثبت‌نام و ورود' },
  ];

  const handleNavClick = (view: ActiveView) => {
    setMobileMenuOpen(false);
    if (view === 'store' && activeView === 'store') {
      onNavigateStoreCatalog();
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F6F6F4]/95 backdrop-blur-sm border-b border-neutral-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('store')}
          className="text-xl font-bold tracking-tight text-[#111315] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
        >
          رایاسلیکون
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="منوی اصلی"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-neutral-600"
        >
          {navItems.map((item) => {
            const isActive =
              activeView === item.id || (item.id === 'store' && activeView === 'product');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF] ${
                  isActive
                    ? 'text-[#111315] after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:bg-[#1E40AF]'
                    : 'hover:text-[#111315]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action (Cart Drawer Trigger) + Mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2.5 px-4 py-2 min-h-[40px] bg-[#111315] text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سبد خرید</span>
            <span className="font-mono tabular-nums text-xs text-neutral-300">
              ({formatPersianNumber(cartCount)})
            </span>
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-300 text-[#111315] hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-[#1E40AF]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
