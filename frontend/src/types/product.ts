export interface Producer {
  name: string;
  owner: string;
  city: string;
  province: string;
  waNumber: string;
  story: string;
  avatar: string;
  establishedYear: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'snack' | 'sambal' | 'kue' | 'frozen' | 'minuman' | 'lauk';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  image: string;
  gallery: string[];
  description: string;
  ingredients: string[];
  shelfLife: string;
  spicyLevel?: number; // 0 to 5
  certifications: string[];
  producer: Producer;
  isBestSeller?: boolean;
  isNew?: boolean;
  stockStatus: 'ready' | 'preorder';
  weightGram: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export type CategoryOption = {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  items: CartItem[];
  totalPrice: number;
  totalWeightGram: number;
  status: OrderStatus;
  shippingCourier?: string;
  trackingNumber?: string;
}

export interface PartnerSubmission {
  id: string;
  brandName: string;
  ownerName: string;
  city: string;
  waNumber: string;
  category: string;
  certification: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  primaryPhone: string;
  email: string;
  address: string;
  bankAccount: string;
  bankName: string;
  bankHolder: string;
  announcement: string;
}
