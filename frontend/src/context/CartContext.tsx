'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  PartnerSubmission, 
  StoreSettings,
  CategoryOption
} from '@/types/product';
import { 
  authApi, 
  productsApi, 
  categoriesApi,
  ordersApi, 
  partnersApi, 
  settingsApi, 
  healthApi, 
  getAuthToken,
  setAuthToken 
} from '@/lib/api';

export interface UserSession {
  name: string;
  email: string;
  role: 'admin' | 'partner';
  brandName?: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'RasaNusantara UMKM Showcase',
  tagline: 'Katalog Kuliner & Jajanan Khas Pengrajin Indonesia',
  primaryPhone: '6281234567801',
  email: 'halo@rasanusantara.id',
  address: 'Jl. Malioboro No. 45, D.I. Yogyakarta 55271',
  bankAccount: '137-00-1928371-2',
  bankName: 'Bank Mandiri',
  bankHolder: 'Koperasi Mitra UMKM Nusantara',
  announcement: 'Gratis ongkir untuk pengiriman sesama pulau Jawa dengan minimal order Rp 150.000!',
};

interface CartContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, note?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Modal & Filter state
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Categories & Products (100% from Backend API)
  categories: CategoryOption[];
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Orders Management
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
    items: CartItem[];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, courier?: string, tracking?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Partner Submissions
  partners: PartnerSubmission[];
  submitPartner: (partner: Omit<PartnerSubmission, 'id' | 'submittedAt' | 'status'>) => PartnerSubmission;
  updatePartnerStatus: (id: string, status: 'approved' | 'rejected') => Promise<any>;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Auth / Session
  currentUser: UserSession | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Backend Integration Status
  isBackendConnected: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Client local state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collections (100% Loaded from REST API)
  const [rawCategories, setRawCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<PartnerSubmission[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch all live data from backend API
  const refreshData = useCallback(async () => {
    try {
      const isHealthy = await healthApi.check();
      setIsBackendConnected(isHealthy);

      if (!isHealthy) return;

      // 1. Fetch categories
      const catRes = await categoriesApi.getAll();
      if (catRes.success && Array.isArray(catRes.data)) {
        setRawCategories(catRes.data);
      }

      // 2. Fetch products
      const prodRes = await productsApi.getAll();
      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }

      // 3. Fetch settings
      const settRes = await settingsApi.get();
      if (settRes.success && settRes.data) {
        setSettings(settRes.data);
      }

      // 4. Verify auth & fetch authenticated datasets
      const token = getAuthToken();
      if (token) {
        const meRes = await authApi.getMe();
        if (meRes.success && meRes.data) {
          setCurrentUser({
            name: meRes.data.name,
            email: meRes.data.email,
            role: meRes.data.role.toLowerCase() as 'admin' | 'partner',
            brandName: meRes.data.brandName,
          });

          // Fetch orders and partners for authenticated users
          ordersApi.getAll().then((res) => {
            if (res.success && Array.isArray(res.data)) setOrders(res.data);
          }).catch(() => {});

          partnersApi.getAll().then((res) => {
            if (res.success && Array.isArray(res.data)) setPartners(res.data);
          }).catch(() => {});
        } else {
          setAuthToken(null);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to initialize API data:', err);
    }
  }, []);

  // Hydrate on mount
  useEffect(() => {
    // 1. Hydrate cart & wishlist from localStorage
    try {
      const savedCart = localStorage.getItem('umkm_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('umkm_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {}

    // 2. Fetch live data from backend
    refreshData();
  }, [refreshData]);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('umkm_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('umkm_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Dynamic Categories computed with actual product counts from database
  const categories: CategoryOption[] = useMemo(() => {
    const allOption: CategoryOption = {
      id: 'all',
      name: 'Semua Produk',
      icon: 'Utensils',
      count: products.length,
      description: 'Semua pilihan kuliner UMKM pilihan nusantara',
    };

    if (rawCategories.length === 0) {
      // Standard nusantara categories
      const standardCats = [
        { id: 'snack', name: 'Keripik & Cemilan', icon: 'Cookie', description: 'Camilan renyah, gurih, dan manis khas daerah' },
        { id: 'sambal', name: 'Sambal & Bumbu', icon: 'Flame', description: 'Racikan sambal uleg dan bumbu masak rempah alami' },
        { id: 'lauk', name: 'Lauk & Makanan Khas', icon: 'Soup', description: 'Lauk siap santap dengan cita rasa tradisional otentik' },
        { id: 'kue', name: 'Kue & Pastry', icon: 'Cake', description: 'Kue basah, kering, dan jajanan pasar warisan leluhur' },
        { id: 'frozen', name: 'Frozen Food Siap Saji', icon: 'Snowflake', description: 'Olahan makanan beku higienis tanpa bahan pengawet' },
        { id: 'minuman', name: 'Minuman Tradisional', icon: 'Coffee', description: 'Jamu rempah herbal dan olahan kopi petani lokal' },
      ];

      return [
        allOption,
        ...standardCats.map((c) => ({
          ...c,
          count: products.filter((p) => p.category === c.id).length,
        })),
      ];
    }

    return [
      allOption,
      ...rawCategories.map((c) => ({
        ...c,
        count: products.filter((p) => p.category === c.id).length || c.count || 0,
      })),
    ];
  }, [rawCategories, products]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, note?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, note: note || item.note }
            : item
        );
      }
      return [...prev, { product, quantity, note }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Products CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);

    // Send to backend API
    productsApi.create({
      name: newProd.name,
      slug: newProd.slug,
      categoryId: newProd.category,
      price: newProd.price,
      originalPrice: newProd.originalPrice,
      unit: newProd.unit,
      weightGram: newProd.weightGram,
      image: newProd.image,
      description: newProd.description,
      ingredients: newProd.ingredients,
      shelfLife: newProd.shelfLife,
      spicyLevel: newProd.spicyLevel,
      certifications: newProd.certifications,
      producerName: newProd.producer.name,
      producerCity: newProd.producer.city,
      producerWa: newProd.producer.waNumber,
      isBestSeller: newProd.isBestSeller,
      stockStatus: newProd.stockStatus,
      tags: newProd.tags,
    }).then((res) => {
      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === created.id ? res.data : p))
        );
      }
    }).catch(() => {});

    return created;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    // Send to backend API
    productsApi.update(id, {
      ...updated,
      categoryId: updated.category,
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    productsApi.delete(id).catch(() => {});
  };

  const resetProductsToDefault = async () => {
    const res = await productsApi.getAll();
    if (res.success && Array.isArray(res.data)) {
      setProducts(res.data);
    }
  };

  // Orders Management
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
    items: CartItem[];
  }) => {
    const totalPrice = orderData.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalWeightGram = orderData.items.reduce(
      (sum, item) => sum + (item.product.weightGram || 200) * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `RN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      customerNotes: orderData.customerNotes,
      items: orderData.items,
      totalPrice,
      totalWeightGram,
      status: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send to backend API
    ordersApi.create({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      customerNotes: orderData.customerNotes,
      items: orderData.items.map((it) => ({
        productId: it.product.id,
        quantity: it.quantity,
        note: it.note,
      })),
    }).then((res) => {
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...o, ...res.data } : o))
        );
      }
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    courier?: string,
    tracking?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(courier ? { shippingCourier: courier } : {}),
              ...(tracking ? { trackingNumber: tracking } : {}),
            }
          : o
      )
    );

    // Send to backend API
    ordersApi.updateStatus(orderId, {
      status: status.toUpperCase(),
      shippingCourier: courier,
      trackingNumber: tracking,
    }).catch(() => {});
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    ordersApi.delete(orderId).catch(() => {});
  };

  // Partner Submissions
  const submitPartner = (data: Omit<PartnerSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: PartnerSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setPartners((prev) => [newSubmission, ...prev]);

    // Send to backend API
    partnersApi.submit({
      brandName: data.brandName,
      ownerName: data.ownerName,
      city: data.city,
      waNumber: data.waNumber,
      category: data.category,
      certification: data.certification,
      description: data.description,
    }).catch(() => {});

    return newSubmission;
  };

  const updatePartnerStatus = async (id: string, status: 'approved' | 'rejected') => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    // Send to backend API
    try {
      const res = await partnersApi.updateStatus(id, status === 'approved' ? 'APPROVED' : 'REJECTED');
      
      // Jika disetujui, ambil katalog produk terbaru dari backend
      if (status === 'approved') {
        const prodRes = await productsApi.getAll();
        if (prodRes.success && Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        }
      }
      return res;
    } catch {}
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    settingsApi.update(newSettings).catch(() => {});
  };

  // Auth / Session
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!password) {
      return { success: false, message: 'Kata sandi wajib diisi' };
    }

    try {
      const authRes = await authApi.login(email, password);
      if (authRes.success && authRes.data) {
        setAuthToken(authRes.data.token);
        const user: UserSession = {
          name: authRes.data.user.name,
          email: authRes.data.user.email,
          role: authRes.data.user.role.toLowerCase() as 'admin' | 'partner',
          brandName: authRes.data.user.brandName,
        };
        setCurrentUser(user);

        // Fetch live authenticated orders and partners
        ordersApi.getAll().then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setOrders(res.data);
          }
        }).catch(() => {});

        partnersApi.getAll().then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setPartners(res.data);
          }
        }).catch(() => {});

        return { success: true };
      }

      return {
        success: false,
        message: authRes.message || 'Email atau kata sandi tidak sesuai',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Gagal menghubungi server autentikasi',
      };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        categories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        refreshData,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        partners,
        submitPartner,
        updatePartnerStatus,
        settings,
        updateSettings,
        currentUser,
        login,
        logout,
        isBackendConnected,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
