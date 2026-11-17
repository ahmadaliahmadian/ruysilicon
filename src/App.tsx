import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { AccountView } from './components/AccountView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OrdersView } from './components/OrdersView';
import { PcBuilderView } from './components/PcBuilderView';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailView } from './components/ProductDetailView';
import { StoreProvider, useStore } from './context/StoreContext';

function ToastStack() {
  const { toasts } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium bg-white ${
            toast.tone === 'error'
              ? 'border-red-200 text-red-900'
              : toast.tone === 'info'
                ? 'border-neutral-200 text-[#111315]'
                : 'border-emerald-200 text-emerald-900'
          }`}
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : toast.tone === 'info' ? (
            <Info className="w-4 h-4 text-[#1E40AF] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
}

function StoreShell() {
  const { activeView, setActiveView } = useStore();

  const scrollToCatalog = () => {
    setActiveView('store');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F4] text-[#111315]" dir="rtl">
      <Header onNavigateStoreCatalog={scrollToCatalog} />

      <main className="flex-1">
        {activeView === 'store' && (
          <>
            <HeroSection
              onExploreCatalog={scrollToCatalog}
              onOpenBuilder={() => {
                setActiveView('builder');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <ProductCatalog />
            <CraftsmanshipSection />
          </>
        )}

        {activeView === 'product' && <ProductDetailView />}
        {activeView === 'builder' && <PcBuilderView />}
        {activeView === 'account' && <AccountView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'checkout' && <CheckoutView />}
      </main>

      <Footer />
      <CartDrawer />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <StoreShell />
      </StoreProvider>
    </ErrorBoundary>
  );
}
