export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number; // in BDT
  originalPrice?: number;
  category: 'Smartwatches' | 'Audio & TWS' | 'Chargers & Power' | 'Gaming & Desk' | 'Accessories' | 'Fashion' | string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  badge?: 'Bestseller' | 'Hot Deal' | 'New Arrival' | 'Trending' | '50% OFF';
  image: string;
  gallery?: string[];
  shortDesc: string;
  features: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  warranty?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  deliveryArea: 'dhaka' | 'outside';
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  payment: PaymentDetails;
  deliveryCharge: number;
  subtotal: number;
  total: number;
  createdAt: string;
  status: 'pending_verification' | 'confirmed' | 'dispatched' | 'delivered';
}

export type GoogleSitesTheme = 'aristotle' | 'vision' | 'level' | 'impression' | 'darkCyber';

export interface StoreConfig {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string; // international format without + e.g. 8801572923121
  email?: string;
  address: string;
  bkashNumber: string;
  bkashType: 'Personal' | 'Merchant';
  nagadNumber: string;
  nagadType: 'Personal' | 'Merchant';
  rocketNumber: string;
  rocketType: 'Personal' | 'Merchant';
  deliveryDhaka: number;
  deliveryOutside: number;
  currency: string;
  freeDeliveryThreshold: number;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  bannerImage?: string;
}
