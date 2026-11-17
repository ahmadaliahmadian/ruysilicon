import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { getProductById, getProductEffectivePrice } from '../data/products';
import {
  ActiveView,
  CartItemEntry,
  OrderRecord,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
  UserProfile,
} from '../types/hardware';

const GUEST_CART_KEY = 'rayasilicon_guest_cart_v1';
const VARIANT_CACHE_KEY = 'rayasilicon_variant_map_v1';

interface ToastMessage {
  id: number;
  text: string;
  tone: 'success' | 'info' | 'error';
}

interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  discountCode: string;
}

interface StoreContextValue {
  user: User | null;
  authReady: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  cartItems: CartItemEntry[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountRate: number;
  addToCart: (productId: string, quantity?: number, variantId?: string, openDrawer?: boolean) => Promise<void>;
  addManyToCart: (productIds: string[]) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  saveProfile: (input: Omit<UserProfile, 'uid' | 'email' | 'profileCompleted'>) => Promise<void>;
  orders: OrderRecord[];
  ordersLoading: boolean;
  placeOrder: (input: PlaceOrderInput) => Promise<OrderRecord>;
  cancelOrder: (orderId: string) => Promise<void>;
  lastConfirmedOrder: OrderRecord | null;
  setLastConfirmedOrder: (order: OrderRecord | null) => void;
  toasts: ToastMessage[];
  notify: (text: string, tone?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function readGuestCart(): CartItemEntry[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItemEntry =>
        typeof item?.productId === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity >= 1 &&
        Boolean(getProductById(item.productId))
    );
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartItemEntry[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota issues
  }
}

function readVariantMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(VARIANT_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeVariantMap(map: Record<string, string>) {
  try {
    localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota issues
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [activeView, setActiveView] = useState<ActiveView>('store');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItemEntry[]>(() => readGuestCart());
  const [variantMap, setVariantMap] = useState<Record<string, string>>(() => readVariantMap());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<OrderRecord | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((text: string, tone: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const openProductDetail = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Ensure user profile exists on sign-in and merge guest cart items
  const ensureUserProfileAndMergeCart = useCallback(async (signedUser: User) => {
    const userRef = doc(db, 'users', signedUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const initialProfile = {
          uid: signedUser.uid,
          email: (signedUser.email || 'user@rayasilicon.ir').slice(0, 150),
          fullName: (signedUser.displayName || 'کاربر رایاسلیکون').slice(0, 100),
          phone: '',
          province: '',
          city: '',
          address: '',
          postalCode: '',
          profileCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, initialProfile);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${signedUser.uid}`);
    }

    const guestItems = readGuestCart();
    if (guestItems.length > 0) {
      try {
        const batch = writeBatch(db);
        for (const item of guestItems) {
          const cartRef = doc(db, 'users', signedUser.uid, 'cart', item.productId);
          batch.set(cartRef, {
            productId: item.productId,
            quantity: Math.min(20, Math.max(1, Math.round(item.quantity))),
            addedAt: serverTimestamp(),
          });
        }
        await batch.commit();
        localStorage.removeItem(GUEST_CART_KEY);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${signedUser.uid}/cart`);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setProfile(null);
        setOrders([]);
        setCartItems(readGuestCart());
      } else {
        void ensureUserProfileAndMergeCart(nextUser);
      }
    });
    return () => unsubscribe();
  }, [ensureUserProfileAndMergeCart]);

  // Listen to authenticated user's profile, cart, and orders
  useEffect(() => {
    if (!authReady || !user) return;

    setProfileLoading(true);
    const userPath = `users/${user.uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            uid: String(data.uid || user.uid),
            email: String(data.email || user.email || ''),
            fullName: String(data.fullName || ''),
            phone: String(data.phone || ''),
            province: String(data.province || ''),
            city: String(data.city || ''),
            address: String(data.address || ''),
            postalCode: String(data.postalCode || ''),
            profileCompleted: Boolean(data.profileCompleted),
          });
        }
        setProfileLoading(false);
      },
      (error) => {
        setProfileLoading(false);
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );

    const cartPath = `users/${user.uid}/cart`;
    const unsubCart = onSnapshot(
      collection(db, 'users', user.uid, 'cart'),
      (snap) => {
        const items: CartItemEntry[] = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              productId: String(data.productId || d.id),
              quantity: Number(data.quantity || 1),
              variantId: variantMap[String(data.productId || d.id)],
            };
          })
          .filter((entry) => Boolean(getProductById(entry.productId)));
        setCartItems(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, cartPath);
      }
    );

    setOrdersLoading(true);
    const ordersPath = 'orders';
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snap) => {
        const list: OrderRecord[] = snap.docs
          .map((d) => {
            const data = d.data();
            const createdMillis =
              data.createdAt && typeof data.createdAt.toMillis === 'function'
                ? data.createdAt.toMillis()
                : Date.now();
            return {
              id: d.id,
              orderNumber: String(data.orderNumber || d.id),
              userId: String(data.userId),
              customerName: String(data.customerName || ''),
              customerPhone: String(data.customerPhone || ''),
              shippingAddress: String(data.shippingAddress || ''),
              shippingMethod: (data.shippingMethod || 'express') as ShippingMethod,
              paymentMethod: (data.paymentMethod || 'online') as PaymentMethod,
              discountCode: String(data.discountCode || ''),
              subtotal: Number(data.subtotal || 0),
              shippingCost: Number(data.shippingCost || 0),
              discountAmount: Number(data.discountAmount || 0),
              totalAmount: Number(data.totalAmount || 0),
              status: (data.status || 'confirmed') as OrderStatus,
              itemsCount: Number(data.itemsCount || 1),
              itemsSummary: String(data.itemsSummary || ''),
              createdAtMs: createdMillis,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setOrders(list);
        setOrdersLoading(false);
      },
      (error) => {
        setOrdersLoading(false);
        handleFirestoreError(error, OperationType.LIST, ordersPath);
      }
    );

    return () => {
      unsubProfile();
      unsubCart();
      unsubOrders();
    };
  }, [authReady, user, variantMap]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      notify('ورود به حساب کاربری با موفقیت انجام شد.', 'success');
      return result.user;
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (!msg.includes('popup-closed-by-user')) {
        notify('ورود با حساب گوگل انجام نشد. لطفاً مجدداً تلاش کنید.', 'error');
      }
      return null;
    }
  }, [notify]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    notify('از حساب کاربری خارج شدید.', 'info');
    if (activeView === 'orders' || activeView === 'account') {
      setActiveView('store');
    }
  }, [activeView, notify]);

  const saveProfile = useCallback(
    async (input: Omit<UserProfile, 'uid' | 'email' | 'profileCompleted'>) => {
      if (!user) return;
      const path = `users/${user.uid}`;
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const cleanPayload = {
          fullName: input.fullName.trim().slice(0, 100) || 'کاربر رایاسلیکون',
          phone: input.phone.trim().slice(0, 20),
          province: input.province.trim().slice(0, 60),
          city: input.city.trim().slice(0, 60),
          address: input.address.trim().slice(0, 300),
          postalCode: input.postalCode.trim().slice(0, 20),
          profileCompleted: Boolean(
            input.fullName.trim().length >= 2 &&
              input.phone.trim().length >= 8 &&
              input.address.trim().length >= 5
          ),
          updatedAt: serverTimestamp(),
        };

        if (snap.exists()) {
          await updateDoc(userRef, cleanPayload);
        } else {
          await setDoc(userRef, {
            uid: user.uid,
            email: (user.email || 'user@rayasilicon.ir').slice(0, 150),
            ...cleanPayload,
            createdAt: serverTimestamp(),
          });
        }
        notify('اطلاعات کاربری و نشانی شما ذخیره شد.', 'success');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [notify, user]
  );

  const persistVariant = useCallback((productId: string, variantId?: string) => {
    if (!variantId) return;
    setVariantMap((prev) => {
      const next = { ...prev, [productId]: variantId };
      writeVariantMap(next);
      return next;
    });
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId?: string, openDrawer = true) => {
      const product = getProductById(productId);
      if (!product) return;

      persistVariant(productId, variantId);
      const existing = cartItems.find((i) => i.productId === productId);
      const nextQty = Math.min(20, Math.max(1, (existing?.quantity || 0) + quantity));

      if (!user) {
        const nextList = existing
          ? cartItems.map((i) => (i.productId === productId ? { ...i, quantity: nextQty, variantId } : i))
          : [...cartItems, { productId, quantity: nextQty, variantId }];
        setCartItems(nextList);
        writeGuestCart(nextList);
      } else {
        const path = `users/${user.uid}/cart/${productId}`;
        try {
          const itemRef = doc(db, 'users', user.uid, 'cart', productId);
          if (existing) {
            await updateDoc(itemRef, {
              quantity: nextQty,
              addedAt: serverTimestamp(),
            });
          } else {
            await setDoc(itemRef, {
              productId,
              quantity: nextQty,
              addedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      }

      notify(`«${product.title}» به سبد خرید اضافه شد.`, 'success');
      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    [cartItems, notify, persistVariant, user]
  );

  const addManyToCart = useCallback(
    async (productIds: string[]) => {
      const validIds = productIds.filter((id) => Boolean(getProductById(id)));
      if (validIds.length === 0) return;

      if (!user) {
        const map = new Map<string, CartItemEntry>();
        for (const item of cartItems) map.set(item.productId, { ...item });
        for (const id of validIds) {
          const prev = map.get(id);
          map.set(id, {
            productId: id,
            quantity: Math.min(20, (prev?.quantity || 0) + 1),
            variantId: prev?.variantId,
          });
        }
        const nextList = Array.from(map.values());
        setCartItems(nextList);
        writeGuestCart(nextList);
      } else {
        const path = `users/${user.uid}/cart`;
        try {
          const batch = writeBatch(db);
          for (const id of validIds) {
            const prev = cartItems.find((i) => i.productId === id);
            const itemRef = doc(db, 'users', user.uid, 'cart', id);
            batch.set(itemRef, {
              productId: id,
              quantity: Math.min(20, (prev?.quantity || 0) + 1),
              addedAt: serverTimestamp(),
            });
          }
          await batch.commit();
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      }

      notify(`${validIds.length} قطعه پیکربندی سیستم به سبد خرید اضافه شد.`, 'success');
      setIsCartOpen(true);
    },
    [cartItems, notify, user]
  );

  const updateCartQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        if (!user) {
          const nextList = cartItems.filter((i) => i.productId !== productId);
          setCartItems(nextList);
          writeGuestCart(nextList);
        } else {
          const path = `users/${user.uid}/cart/${productId}`;
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'cart', productId));
          } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, path);
          }
        }
        return;
      }

      const clamped = Math.min(20, Math.max(1, Math.round(quantity)));
      if (!user) {
        const nextList = cartItems.map((i) =>
          i.productId === productId ? { ...i, quantity: clamped } : i
        );
        setCartItems(nextList);
        writeGuestCart(nextList);
      } else {
        const path = `users/${user.uid}/cart/${productId}`;
        try {
          await updateDoc(doc(db, 'users', user.uid, 'cart', productId), {
            quantity: clamped,
            addedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      }
    },
    [cartItems, user]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      await updateCartQuantity(productId, 0);
      notify('قطعه از سبد خرید حذف شد.', 'info');
    },
    [notify, updateCartQuantity]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (!product) return sum;
        const unitPrice = getProductEffectivePrice(product, item.variantId || variantMap[product.id]);
        return sum + unitPrice * item.quantity;
      }, 0),
    [cartItems, variantMap]
  );

  const discountRate = useMemo(() => {
    const normalized = promoCode.trim().toUpperCase();
    return normalized === 'RAYA10' ? 0.1 : 0;
  }, [promoCode]);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<OrderRecord> => {
      if (!user) {
        throw new Error('ابتدا باید وارد حساب کاربری شوید.');
      }
      if (cartItems.length === 0) {
        throw new Error('سبد خرید شما خالی است.');
      }

      const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const orderNumber = `RS-${String(Math.floor(100000 + Math.random() * 899999))}`;
      const subtotal = cartSubtotal;
      const normalizedCode = input.discountCode.trim().toUpperCase().slice(0, 30);
      const discountAmount = normalizedCode === 'RAYA10' ? Math.round(subtotal * 0.1) : 0;
      const freeShippingEligible = subtotal >= 20000000;
      const shippingCost =
        input.shippingMethod === 'pickup'
          ? 0
          : freeShippingEligible
            ? 0
            : input.shippingMethod === 'express'
              ? 250000
              : 180000;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

      const summaryParts = cartItems
        .map((entry) => {
          const prod = getProductById(entry.productId);
          return prod ? `${prod.title} × ${entry.quantity}` : '';
        })
        .filter(Boolean);
      const itemsSummary = summaryParts.join(' · ').slice(0, 600) || 'قطعات کامپیوتر';
      const itemsCount = Math.min(
        50,
        cartItems.reduce((acc, item) => acc + item.quantity, 0)
      );

      const orderPath = `orders/${orderId}`;
      try {
        const batch = writeBatch(db);
        const orderRef = doc(db, 'orders', orderId);

        batch.set(orderRef, {
          orderNumber,
          userId: user.uid,
          customerName: input.customerName.trim().slice(0, 100),
          customerPhone: input.customerPhone.trim().slice(0, 20),
          shippingAddress: input.shippingAddress.trim().slice(0, 350),
          shippingMethod: input.shippingMethod,
          paymentMethod: input.paymentMethod,
          discountCode: normalizedCode,
          subtotal,
          shippingCost,
          discountAmount,
          totalAmount,
          status: 'confirmed',
          itemsCount,
          itemsSummary,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        for (const entry of cartItems) {
          const prod = getProductById(entry.productId);
          if (!prod) continue;
          const unitPrice = getProductEffectivePrice(prod, entry.variantId || variantMap[prod.id]);
          const itemDocId = `itm_${prod.id}`;
          const orderItemRef = doc(db, 'orders', orderId, 'items', itemDocId);
          batch.set(orderItemRef, {
            orderId,
            userId: user.uid,
            productId: prod.id,
            title: prod.title.slice(0, 160),
            unitPrice,
            quantity: Math.min(20, Math.max(1, entry.quantity)),
          });

          const cartItemRef = doc(db, 'users', user.uid, 'cart', prod.id);
          batch.delete(cartItemRef);
        }

        await batch.commit();

        const createdRecord: OrderRecord = {
          id: orderId,
          orderNumber,
          userId: user.uid,
          customerName: input.customerName.trim(),
          customerPhone: input.customerPhone.trim(),
          shippingAddress: input.shippingAddress.trim(),
          shippingMethod: input.shippingMethod,
          paymentMethod: input.paymentMethod,
          discountCode: normalizedCode,
          subtotal,
          shippingCost,
          discountAmount,
          totalAmount,
          status: 'confirmed',
          itemsCount,
          itemsSummary,
          createdAtMs: Date.now(),
        };

        setLastConfirmedOrder(createdRecord);
        setPromoCode('');
        notify(`سفارش ${orderNumber} با موفقیت ثبت شد.`, 'success');
        return createdRecord;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, orderPath);
      }
    },
    [cartItems, cartSubtotal, notify, user, variantMap]
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!user) return;
      const path = `orders/${orderId}`;
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
        notify('سفارش لغو شد.', 'info');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [notify, user]
  );

  const value: StoreContextValue = {
    user,
    authReady,
    profile,
    profileLoading,
    activeView,
    setActiveView,
    selectedProductId,
    openProductDetail,
    cartItems,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    promoCode,
    setPromoCode,
    discountRate,
    addToCart,
    addManyToCart,
    updateCartQuantity,
    removeFromCart,
    signInWithGoogle,
    signOut,
    saveProfile,
    orders,
    ordersLoading,
    placeOrder,
    cancelOrder,
    lastConfirmedOrder,
    setLastConfirmedOrder,
    toasts,
    notify,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
