export type HardwareCategory =
  | 'gpu'
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'ssd'
  | 'cooler'
  | 'psu';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
}

export interface HardwareProduct {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: HardwareCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  warranty: string;
  image: string;
  shortSpecs: string;
  description: string;
  specs: ProductSpec[];
  compatibility: {
    socket?: 'LGA1851' | 'AM5';
    ramType?: 'DDR5';
    wattDraw?: number;
    psuWattage?: number;
    formFactor?: string;
  };
  variants: ProductVariant[];
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  profileCompleted: boolean;
}

export interface CartItemEntry {
  productId: string;
  quantity: number;
  variantId?: string;
}

export type ShippingMethod = 'express' | 'post' | 'pickup';
export type PaymentMethod = 'online' | 'cod';
export type OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  discountCode: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  itemsCount: number;
  itemsSummary: string;
  createdAtMs: number;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface ProductReviewRecord {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAtMs: number;
}

export type ActiveView = 'store' | 'product' | 'builder' | 'account' | 'orders' | 'checkout';
