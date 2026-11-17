import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ChevronDown, ChevronUp, Package, XCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { formatPersianNumber, formatToman } from '../data/products';
import { useStore } from '../context/StoreContext';
import { OrderItemRecord, OrderStatus } from '../types/hardware';

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: 'تایید شده · در صف پردازش',
  preparing: 'در حال آماده‌سازی و تست',
  shipped: 'تحویل به شرکت حمل‌ونقل',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

const STATUS_TONE: Record<OrderStatus, string> = {
  confirmed: 'text-[#1E40AF]',
  preparing: 'text-amber-700',
  shipped: 'text-indigo-700',
  delivered: 'text-emerald-700',
  cancelled: 'text-neutral-500',
};

const SHIPPING_LABELS = {
  express: 'ارسال اکسپرس ویژه',
  post: 'پست پیشتاز بیمه‌شده',
  pickup: 'تحویل حضوری',
};

export function OrdersView() {
  const { user, orders, ordersLoading, signInWithGoogle, cancelOrder, setActiveView } = useStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, OrderItemRecord[]>>({});
  const [loadingItemsId, setLoadingItemsId] = useState<string | null>(null);

  if (!user) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-[#111315] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#111315]">پیگیری سفارش‌ها</h1>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            برای مشاهده تاریخچه خریدها، جزئیات فاکتور و پیگیری وضعیت ارسال، وارد حساب کاربری خود شوید.
          </p>
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="px-6 py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ورود با حساب گوگل
          </button>
        </div>
      </section>
    );
  }

  const toggleExpandOrder = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);
    if (orderItemsMap[orderId]) return;

    setLoadingItemsId(orderId);
    const itemsPath = `orders/${orderId}/items`;
    try {
      const q = query(
        collection(db, 'orders', orderId, 'items'),
        where('userId', '==', user.uid)
      );
      const snap = await getDocs(q);
      const list: OrderItemRecord[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          orderId: String(data.orderId || orderId),
          userId: String(data.userId || user.uid),
          productId: String(data.productId || ''),
          title: String(data.title || ''),
          unitPrice: Number(data.unitPrice || 0),
          quantity: Number(data.quantity || 1),
        };
      });
      setOrderItemsMap((prev) => ({ ...prev, [orderId]: list }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, itemsPath);
    } finally {
      setLoadingItemsId(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-1">سوابق خرید و پیگیری مرسوله</p>
          <h1 className="text-2xl font-bold text-[#111315]">سفارش‌های من</h1>
        </div>
        <span className="text-xs text-neutral-500 tabular-nums">
          مجموع سفارش‌ها: {formatPersianNumber(orders.length)}
        </span>
      </div>

      {ordersLoading ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-sm text-neutral-500">
          در حال دریافت فهرست سفارش‌ها...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center space-y-4">
          <Package className="w-10 h-10 text-neutral-300 mx-auto" />
          <h2 className="text-base font-bold text-[#111315]">هنوز سفارشی ثبت نکرده‌اید</h2>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            پس از انتخاب قطعات و تکمیل فرآیند خرید، جزئیات کامل فاکتور و وضعیت ارسال اینجا نمایش داده می‌شود.
          </p>
          <button
            type="button"
            onClick={() => setActiveView('store')}
            className="px-5 py-2.5 bg-[#111315] text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            مشاهده فروشگاه
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItemsMap[order.id] || [];
            const canCancel = order.status === 'confirmed' || order.status === 'preparing';

            return (
              <article
                key={order.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span dir="ltr" className="font-mono font-semibold text-[#111315]">
                        {order.orderNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {new Date(order.createdAtMs).toLocaleDateString('fa-IR')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-semibold ${STATUS_TONE[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#111315] line-clamp-1">
                      {order.itemsSummary}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {SHIPPING_LABELS[order.shippingMethod]} · {order.shippingAddress}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-right md:text-left">
                      <span className="block text-xs text-neutral-500">مبلغ کل</span>
                      <span className="text-base font-bold text-[#111315] tabular-nums">
                        {formatToman(order.totalAmount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => void toggleExpandOrder(order.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-neutral-300 hover:border-[#111315] text-xs font-semibold text-[#111315] rounded-lg transition-colors cursor-pointer"
                    >
                      <span>جزئیات</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-neutral-100 bg-[#F6F6F4] space-y-4">
                    {loadingItemsId === order.id ? (
                      <p className="text-xs text-neutral-500">در حال بارگذاری اقلام فاکتور...</p>
                    ) : (
                      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-3 flex items-center justify-between gap-4 text-xs"
                          >
                            <span className="font-medium text-[#111315]">
                              {item.title} × {formatPersianNumber(item.quantity)}
                            </span>
                            <span className="font-semibold tabular-nums text-[#111315]">
                              {formatToman(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600">
                      <div className="flex flex-wrap items-center gap-4 tabular-nums">
                        <span>جمع کالاها: {formatToman(order.subtotal)}</span>
                        {order.discountAmount > 0 && (
                          <span className="text-emerald-700">
                            تخفیف: -{formatToman(order.discountAmount)}
                          </span>
                        )}
                        <span>
                          هزینه ارسال:{' '}
                          {order.shippingCost === 0 ? 'رایگان' : formatToman(order.shippingCost)}
                        </span>
                      </div>

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => void cancelOrder(order.id)}
                          className="inline-flex items-center gap-1.5 text-red-700 hover:text-red-800 font-semibold cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>لغو سفارش</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
