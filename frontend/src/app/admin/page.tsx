'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Product, Order, OrderStatus, PartnerSubmission } from '@/types/product';
import { formatRupiah } from '@/lib/utils';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  MessageCircle, 
  ArrowLeft, 
  LogOut, 
  Star, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Check, 
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProductsToDefault,
    orders, 
    updateOrderStatus, 
    deleteOrder,
    partners, 
    updatePartnerStatus,
    settings, 
    updateSettings,
    currentUser, 
    logout,
    isBackendConnected
  } = useCart();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'partners' | 'settings'>('overview');
  const isAdmin = currentUser?.role === 'admin';

  // Protect admin route - redirect unauthenticated users to /login
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('umkm_auth_token') : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Restrict partners & settings tabs to Super Admin only
  useEffect(() => {
    if (currentUser && currentUser.role === 'partner' && (activeTab === 'partners' || activeTab === 'settings')) {
      setActiveTab('overview');
    }
  }, [currentUser, activeTab]);

  const [partnerAlert, setPartnerAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [processingPartnerId, setProcessingPartnerId] = useState<string | null>(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'snack' as Product['category'],
    categoryLabel: 'Keripik & Cemilan',
    price: 25000,
    originalPrice: 0,
    unit: 'Pouch 200g',
    weightGram: 200,
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=800&q=80',
    description: '',
    ingredientsStr: 'Kedelai Lokal, Bawang Putih, Garam',
    shelfLife: '3 Bulan (Suhu Ruang)',
    spicyLevel: 0,
    certificationsStr: 'Halal Indonesia ID3511..., P-IRT 21535...',
    producerName: 'Dapur Bu Harti',
    producerOwner: 'Ibu Sri Hartatik',
    producerCity: 'Malang',
    producerProvince: 'Jawa Timur',
    producerWa: '6281234567801',
    isBestSeller: false,
    stockStatus: 'ready' as 'ready' | 'preorder',
  });

  // Order modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalStatus, setOrderModalStatus] = useState<OrderStatus>('pending');
  const [orderCourier, setOrderCourier] = useState('');
  const [orderTracking, setOrderTracking] = useState('');

  // Search & Filter in Tables
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Filter products: Super Admin views all, Mitra UMKM only views their own products
  const userProducts = useMemo(() => {
    if (isAdmin) return products;
    const brand = currentUser?.brandName?.toLowerCase();
    if (!brand) return products;
    return products.filter((p) => p.producer.name.toLowerCase().includes(brand));
  }, [products, isAdmin, currentUser]);

  // Filter orders: Super Admin views all, Mitra UMKM views orders containing their products
  const userOrders = useMemo(() => {
    if (isAdmin) return orders;
    const brand = currentUser?.brandName?.toLowerCase();
    if (!brand) return orders;
    return orders.filter((o) =>
      o.items.some((item) => item.product.producer.name.toLowerCase().includes(brand))
    );
  }, [orders, isAdmin, currentUser]);

  // Statistics calculation scoped to user role
  const totalRevenue = useMemo(() => {
    return userOrders.reduce((sum, ord) => ord.status !== 'cancelled' ? sum + ord.totalPrice : sum, 0);
  }, [userOrders]);

  const pendingOrdersCount = useMemo(() => {
    return userOrders.filter((o) => o.status === 'pending').length;
  }, [userOrders]);

  // Product list filtering
  const filteredProducts = useMemo(() => {
    return userProducts.filter((p) => {
      const matchQuery = productSearch === '' || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.producer.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.producer.city.toLowerCase().includes(productSearch.toLowerCase());
      const prodCatId = typeof p.category === 'string' ? p.category : (p as any).category?.id || (p as any).categoryId;
      const matchCat = productCategoryFilter === 'all' || prodCatId === productCategoryFilter;
      return matchQuery && matchCat;
    });
  }, [userProducts, productSearch, productCategoryFilter]);

  // Orders list filtering
  const filteredOrders = useMemo(() => {
    return userOrders.filter((o) => {
      const matchQuery = orderSearch === '' ||
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch);
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchQuery && matchStatus;
    });
  }, [userOrders, orderSearch, orderStatusFilter]);

  // Category labels helper
  const categoryLabelsMap: Record<Product['category'], string> = {
    snack: 'Keripik & Cemilan',
    sambal: 'Sambal & Bumbu',
    lauk: 'Lauk & Makanan Khas',
    kue: 'Kue & Pastry',
    frozen: 'Frozen Food Siap Saji',
    minuman: 'Minuman Tradisional'
  };

  // Preset image library helper for quick additions
  const PRESET_IMAGES = [
    { label: 'Keripik Tempe', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sambal Botol', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
    { label: 'Rendang Sapi', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lapis Legit', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pempek Asli', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jamu Rempah', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
  ];

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'snack',
      categoryLabel: 'Keripik & Cemilan',
      price: 25000,
      originalPrice: 0,
      unit: 'Pouch 200g',
      weightGram: 200,
      image: PRESET_IMAGES[0].url,
      description: '',
      ingredientsStr: 'Bahan Lokal Pilihan, Bumbu Rempah Alami, Garam Laut',
      shelfLife: '3 Bulan (Suhu Ruang)',
      spicyLevel: 0,
      certificationsStr: 'Halal Indonesia ID351100000000, P-IRT 215357300000',
      producerName: currentUser?.brandName || 'Dapur Mitra UMKM',
      producerOwner: currentUser?.name || 'Ibu Pelaku Usaha',
      producerCity: 'Bandung',
      producerProvince: 'Jawa Barat',
      producerWa: '6281234567801',
      isBestSeller: false,
      stockStatus: 'ready',
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      categoryLabel: prod.categoryLabel,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      unit: prod.unit,
      weightGram: prod.weightGram || 200,
      image: prod.image,
      description: prod.description,
      ingredientsStr: prod.ingredients.join(', '),
      shelfLife: prod.shelfLife,
      spicyLevel: prod.spicyLevel || 0,
      certificationsStr: prod.certifications.join(', '),
      producerName: prod.producer.name,
      producerOwner: prod.producer.owner,
      producerCity: prod.producer.city,
      producerProvince: prod.producer.province,
      producerWa: prod.producer.waNumber,
      isBestSeller: !!prod.isBestSeller,
      stockStatus: prod.stockStatus,
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = productForm.ingredientsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const certifications = productForm.certificationsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const categoryLabel = categoryLabelsMap[productForm.category] || 'Kuliner UMKM';

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        category: productForm.category,
        categoryLabel,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        unit: productForm.unit,
        weightGram: Number(productForm.weightGram),
        image: productForm.image,
        description: productForm.description,
        ingredients,
        shelfLife: productForm.shelfLife,
        spicyLevel: Number(productForm.spicyLevel),
        certifications,
        isBestSeller: productForm.isBestSeller,
        stockStatus: productForm.stockStatus,
        producer: {
          name: productForm.producerName,
          owner: productForm.producerOwner,
          city: productForm.producerCity,
          province: productForm.producerProvince,
          waNumber: productForm.producerWa,
          story: 'Meneruskan tradisi kuliner lokal berkualitas tinggi dengan resep warisan keluarga.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          establishedYear: 2020,
        }
      });
    } else {
      addProduct({
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productForm.category,
        categoryLabel,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        unit: productForm.unit,
        weightGram: Number(productForm.weightGram),
        rating: 5.0,
        reviewCount: 1,
        soldCount: 0,
        image: productForm.image,
        gallery: [productForm.image],
        description: productForm.description,
        ingredients,
        shelfLife: productForm.shelfLife,
        spicyLevel: Number(productForm.spicyLevel),
        certifications,
        isBestSeller: productForm.isBestSeller,
        isNew: true,
        stockStatus: productForm.stockStatus,
        tags: [productForm.producerCity, categoryLabel, 'Produk Baru'],
        producer: {
          name: productForm.producerName,
          owner: productForm.producerOwner,
          city: productForm.producerCity,
          province: productForm.producerProvince,
          waNumber: productForm.producerWa,
          story: 'Mitra kuliner lokal yang berfokus menyajikan cita rasa khas daerah dengan bahan baku petani lokal.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          establishedYear: 2022,
        }
      });
    }

    setIsProductModalOpen(false);
  };

  // Open Order details modal
  const handleOpenOrderModal = (ord: Order) => {
    setSelectedOrder(ord);
    setOrderModalStatus(ord.status);
    setOrderCourier(ord.shippingCourier || '');
    setOrderTracking(ord.trackingNumber || '');
  };

  // Save Order status changes
  const handleSaveOrderStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, orderModalStatus, orderCourier, orderTracking);
    setSelectedOrder(null);
  };

  // Send WhatsApp shipping receipt / confirmation to customer
  const handleSendReceiptWA = (ord: Order) => {
    const phone = ord.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

    let message = `Halo Kak ${ord.customerName}! 👋\n` +
      `Update status pesanan Anda di *RasaNusantara UMKM*:\n\n` +
      `📦 *No. Pesanan:* ${ord.orderNumber}\n` +
      `📊 *Status:* ${getStatusBadgeLabel(ord.status)}\n` +
      `💰 *Total:* ${formatRupiah(ord.totalPrice)}\n`;

    if (ord.shippingCourier) {
      message += `🚚 *Kurir:* ${ord.shippingCourier}\n`;
    }
    if (ord.trackingNumber) {
      message += `🔢 *No. Resi:* ${ord.trackingNumber}\n`;
    }

    message += `\nTerima kasih telah mendukung UMKM lokal! Jika ada pertanyaan, jangan ragu untuk chat kami. 🙏`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2000);
  };

  // Handle Partner Approval - Auto adds to catalog etalase
  const handleApprovePartner = async (partner: PartnerSubmission) => {
    setProcessingPartnerId(partner.id);
    try {
      const res = await updatePartnerStatus(partner.id, 'approved');
      const msg = res?.message || `Pendaftaran ${partner.brandName} berhasil disetujui! Profil produsen, akun login, dan produk perdana otomatis ditambahkan ke katalog etalase.`;
      setPartnerAlert({ message: msg, type: 'success' });
    } catch {
      setPartnerAlert({ message: 'Terjadi kendala saat memperbarui status mitra.', type: 'info' });
    } finally {
      setProcessingPartnerId(null);
    }
  };

  const handleRejectPartner = async (partner: PartnerSubmission) => {
    setProcessingPartnerId(partner.id);
    try {
      await updatePartnerStatus(partner.id, 'rejected');
      setPartnerAlert({ message: `Pendaftaran ${partner.brandName} telah ditolak.`, type: 'info' });
    } catch {
      setPartnerAlert({ message: 'Terjadi kendala saat memperbarui status mitra.', type: 'info' });
    } finally {
      setProcessingPartnerId(null);
    }
  };

  // Helper status badge label & styling
  function getStatusBadgeLabel(status: OrderStatus) {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'processing': return 'Sedang Dikemas / Dimasak';
      case 'shipped': return 'Dalam Pengiriman';
      case 'completed': return 'Pesanan Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  }

  function getStatusBadgeClass(status: OrderStatus) {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'processing': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'completed': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'cancelled': return 'bg-rose-100 text-rose-900 border-rose-300';
      default: return 'bg-stone-100 text-stone-800';
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-stone-900 text-white shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
                  Rasa<span className="text-amber-500">Nusantara</span>
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                  Portal Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* User profile summary */}
          <div className="px-5 py-4 border-b border-stone-800/80 bg-stone-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                {currentUser?.name ? currentUser.name[0] : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Admin Pusat UMKM'}
                </p>
                <p className="text-[10px] text-amber-400 font-semibold truncate">
                  {currentUser?.role === 'partner'
                    ? `🍳 Mitra • ${currentUser.brandName || 'Dapur Bu Harti'}`
                    : '👑 Super Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ringkasan & Analitik</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>{isAdmin ? 'Semua Katalog Produk' : 'Katalog Produk Saya'}</span>
              </div>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-300">
                {userProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Pesanan Masuk</span>
              </div>
              {pendingOrdersCount > 0 ? (
                <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded-full">
                  {pendingOrdersCount} Baru
                </span>
              ) : (
                <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-300">
                  {userOrders.length}
                </span>
              )}
            </button>

            {/* Khusus Super Admin: Tab Pendaftaran Mitra */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('partners')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'partners'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Pendaftaran Mitra</span>
                </div>
                <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-300">
                  {partners.length}
                </span>
              </button>
            )}

            {/* Khusus Super Admin: Tab Pengaturan Portal */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Toko</span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t border-stone-800 space-y-1">
          <a
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4 text-amber-500" />
            <span>Lihat Website Utama</span>
          </a>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {activeTab === 'overview' && 'Ringkasan Kinerja & Penjualan'}
              {activeTab === 'products' && 'Manajemen Katalog Produk Makanan'}
              {activeTab === 'orders' && 'Daftar Pesanan & Status Pengiriman'}
              {activeTab === 'partners' && 'Verifikasi Pendaftaran Mitra Baru'}
              {activeTab === 'settings' && 'Pengaturan Profil Toko & Kontak'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Portal operasional kurasi makanan UMKM RasaNusantara Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Backend Integration Status Indicator */}
            <div
              className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isBackendConnected ? 'Terhubung dengan REST API Backend' : 'Server Backend offline atau menggunakan local cache'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isBackendConnected ? 'API Terhubung' : 'Mode Standalone'}</span>
            </div>

            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Makanan Baru</span>
              </button>
            )}

            <a
              href="/"
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Etalase Depan</span>
            </a>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Estimasi Omzet</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  {formatRupiah(totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ↑ Dari {isAdmin ? orders.length : userOrders.length} total pesanan
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Pesanan Masuk</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  {isAdmin ? orders.length : userOrders.length} Pesanan
                </p>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">
                  {pendingOrdersCount} perlu dikonfirmasi
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Produk Makanan Aktif</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  {isAdmin ? products.length : userProducts.length} Menu
                </p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">
                  Semua terverifikasi P-IRT & Halal
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">
                    {isAdmin ? 'Mitra UMKM Terdaftar' : 'Rating Dapur UMKM'}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    {isAdmin ? <Users className="w-5 h-5" /> : <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
                <p className="text-2xl font-black text-stone-900 mt-2">
                  {isAdmin ? `${partners.length + 10} Pengrajin` : '4.9 ★ Rating'}
                </p>
                <p className="text-[11px] text-purple-700 font-semibold mt-1">
                  {isAdmin ? 'Dari 16 kota di Indonesia' : 'Ulasan Pembeli Riil Terverifikasi'}
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Orders List (2 columns wide) */}
              <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Aktivitas Pesanan Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Lihat Semua ({isAdmin ? orders.length : userOrders.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {(isAdmin ? orders : userOrders).slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleOpenOrderModal(ord)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 hover:bg-amber-50/50 rounded-2xl border border-stone-200/70 cursor-pointer transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-stone-900">
                            {ord.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(ord.status)}`}>
                            {getStatusBadgeLabel(ord.status)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                          Pemesan: <strong className="text-stone-800">{ord.customerName}</strong> ({ord.items.length} item)
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-sm font-extrabold text-stone-900">
                          {formatRupiah(ord.totalPrice)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReceiptWA(ord);
                          }}
                          className="p-2 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl transition cursor-pointer"
                          title="Chat Pembeli via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(isAdmin ? orders : userOrders).length === 0 && (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      Belum ada pesanan terbaru.
                    </div>
                  )}
                </div>
              </div>

              {/* Top Bestsellers preview (1 column wide) */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Produk Paling Laris
                  </h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Katalog →
                  </button>
                </div>

                <div className="space-y-3">
                  {(isAdmin ? products : userProducts)
                    .slice()
                    .sort((a, b) => b.soldCount - a.soldCount)
                    .slice(0, 4)
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-2 bg-stone-50 rounded-2xl">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{p.name}</h4>
                          <p className="text-[11px] text-stone-500 font-semibold">{formatRupiah(p.price)}</p>
                          <p className="text-[10px] text-amber-700 font-medium">{p.soldCount} Terjual ⭐ {p.rating}</p>
                        </div>
                      </div>
                    ))}

                  {(isAdmin ? products : userProducts).length === 0 && (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      Belum ada data produk.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 space-y-4">
            
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari makanan atau nama UMKM..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-700 text-xs py-2 px-3 rounded-xl focus:outline-hidden focus:border-amber-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="snack">Keripik & Cemilan</option>
                  <option value="sambal">Sambal & Bumbu</option>
                  <option value="lauk">Lauk Tradisional</option>
                  <option value="kue">Kue & Pastry</option>
                  <option value="frozen">Frozen Food</option>
                  <option value="minuman">Minuman Herbal</option>
                </select>

                <button
                  onClick={resetProductsToDefault}
                  className="p-2 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 border border-stone-200"
                  title="Kembalikan ke data produk awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Awal</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 font-bold border-y border-stone-100">
                  <tr>
                    <th className="py-3 px-3">Produk</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Produsen UMKM</th>
                    <th className="py-3 px-3">Harga</th>
                    <th className="py-3 px-3">Stok / Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h4 className="font-bold text-stone-900 truncate">{p.name}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                              <span>⭐ {p.rating} ({p.soldCount} terjual)</span>
                              {p.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {(() => {
                          const catId = typeof p.category === 'string' ? p.category : (p as any).category?.id || (p as any).categoryId || 'snack';
                          const metaMap: Record<string, { label: string; icon: string; badgeClass: string }> = {
                            snack: { label: 'Keripik & Cemilan', icon: '🍪', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200' },
                            sambal: { label: 'Sambal & Bumbu', icon: '🌶️', badgeClass: 'bg-rose-50 text-rose-900 border-rose-200' },
                            lauk: { label: 'Lauk Tradisional', icon: '🍲', badgeClass: 'bg-orange-50 text-orange-900 border-orange-200' },
                            kue: { label: 'Kue & Pastry', icon: '🧁', badgeClass: 'bg-pink-50 text-pink-900 border-pink-200' },
                            frozen: { label: 'Frozen Food', icon: '❄️', badgeClass: 'bg-blue-50 text-blue-900 border-blue-200' },
                            minuman: { label: 'Minuman Tradisional', icon: '☕', badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
                          };
                          const meta = metaMap[catId] || { label: p.categoryLabel || catId, icon: '🍽️', badgeClass: 'bg-stone-50 text-stone-800 border-stone-200' };
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border shadow-2xs ${meta.badgeClass}`}>
                              <span>{meta.icon}</span>
                              <span>{p.categoryLabel || meta.label}</span>
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-bold text-stone-800">{p.producer.name}</p>
                        <p className="text-[11px] text-stone-500">{p.producer.city}</p>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-extrabold text-stone-900">{formatRupiah(p.price)}</span>
                        <span className="text-[11px] text-stone-400 block">/{p.unit}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.stockStatus === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.stockStatus === 'ready' ? 'Siap Kirim' : 'Pre-Order'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-lg transition cursor-pointer"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus produk "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 rounded-lg transition cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-xs">
                Tidak ada produk makanan yang cocok dengan pencarian.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 space-y-4">
            
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari No. Order, Nama, No WA..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-700 text-xs py-2 px-3 rounded-xl focus:outline-hidden focus:border-amber-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Konfirmasi</option>
                  <option value="processing">Sedang Dikemas / Dimasak</option>
                  <option value="shipped">Dalam Pengiriman</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 font-bold border-y border-stone-100">
                  <tr>
                    <th className="py-3 px-3">No. Order & Tanggal</th>
                    <th className="py-3 px-3">Pelanggan</th>
                    <th className="py-3 px-3">Rincian Item</th>
                    <th className="py-3 px-3">Total Belanja</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-stone-900 block">{ord.orderNumber}</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-bold text-stone-900">{ord.customerName}</p>
                        <p className="text-[11px] text-stone-500">{ord.customerPhone}</p>
                        <p className="text-[10px] text-stone-400 truncate max-w-xs">{ord.customerAddress}</p>
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          {ord.items && ord.items.map((it, idx) => (
                            <p key={idx} className="text-[11px] text-stone-700 truncate max-w-xs">
                              • {it.quantity}x {it.product?.name || 'Produk Kuliner'}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-extrabold text-stone-900">{formatRupiah(ord.totalPrice)}</span>
                        <span className="text-[10px] text-stone-400 block">±{(ord.totalWeightGram / 1000).toFixed(2)} kg</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-block ${getStatusBadgeClass(ord.status)}`}>
                          {getStatusBadgeLabel(ord.status)}
                        </span>
                        {ord.trackingNumber && (
                          <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                            Resi: {ord.trackingNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenOrderModal(ord)}
                            className="py-1 px-2.5 bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Kelola
                          </button>
                          <button
                            onClick={() => handleSendReceiptWA(ord)}
                            className="p-1.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-lg transition cursor-pointer"
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-xs">
                Tidak ada pesanan yang sesuai dengan filter.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PARTNERS REGISTRATION (SUPER ADMIN ONLY) */}
        {isAdmin && activeTab === 'partners' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Pengajuan Kemitraan UMKM Kuliner
                  </h3>
                  <p className="text-xs text-stone-500">
                    Hanya Super Admin yang dapat meninjau, menyetujui, dan menerbitkan produk mitra ke katalog.
                  </p>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Total: {partners.length} Pengajuan
                </span>
              </div>

              {partnerAlert && (
                <div className={`mt-3 p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 border ${
                  partnerAlert.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{partnerAlert.message}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => {
                const isApproved = partner.status === 'approved';
                const isRejected = partner.status === 'rejected';
                const isPending = !isApproved && !isRejected;
                const isProcessing = processingPartnerId === partner.id;

                const phoneClean = partner.waNumber.replace(/[^0-9]/g, '');
                const waPhone = phoneClean.startsWith('0') ? '62' + phoneClean.slice(1) : phoneClean;
                const waCongrats = `Halo Kak ${partner.ownerName} dari *${partner.brandName}*! 🎉\n\nSelamat, pendaftaran kemitraan Anda di *RasaNusantara* telah *DISETUJUI*! 🥳\n\nProduk kuliner Anda telah resmi diterbitkan di etalase katalog online kami dan siap dipesan pembeli se-Indonesia.\n\nSalam hangat,\nTim Kurasi RasaNusantara`;
                const waRejectMsg = `Halo Kak ${partner.ownerName} dari *${partner.brandName}*.\n\nTerima kasih atas pengajuan kemitraan di RasaNusantara. Mohon maaf untuk saat ini berkas pendaftaran belum dapat kami setujui karena kelengkapan legalitas/dokumen kurasi.\n\nTerima kasih atas pengertiannya. 🙏`;

                return (
                  <div
                    key={partner.id}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {partner.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isApproved ? '✓ Disetujui & Masuk Katalog' : isRejected ? '✗ Ditolak' : '⏳ Menunggu Kurasi'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-stone-900 text-sm mt-2">{partner.brandName}</h4>
                      <p className="text-xs text-stone-600">Pemilik: {partner.ownerName}</p>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{partner.city}</span>
                      </div>

                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-stone-100 text-xs text-stone-600 leading-relaxed italic">
                        &quot;{partner.description}&quot;
                      </div>

                      <p className="text-[11px] text-stone-500 mt-2 font-medium">
                        📜 Izin: <span className="text-stone-700">{partner.certification}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(isApproved ? waCongrats : isRejected ? waRejectMsg : `Halo Kak ${partner.ownerName}, kami dari tim RasaNusantara ingin konfirmasi pendaftaran ${partner.brandName}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{isApproved ? 'WA Selamat' : 'Chat WA'}</span>
                        </a>

                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleApprovePartner(partner)}
                                className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs"
                                title="Setujui pendaftaran dan otomatis terbitkan produk ke katalog"
                              >
                                {isProcessing ? 'Memproses...' : 'Setujui & Masuk Katalog'}
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleRejectPartner(partner)}
                                className="py-1 px-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-60 text-rose-700 rounded-lg text-xs font-semibold cursor-pointer transition"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              Produk Tayang di Etalase
                            </span>
                          )}

                          {isRejected && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleApprovePartner(partner)}
                              className="py-1 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer"
                            >
                              Ubah Disetujui
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS (SUPER ADMIN ONLY) */}
        {isAdmin && activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 max-w-2xl space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Pengaturan Portal & Informasi Kontak
              </h3>
              <p className="text-xs text-stone-500">
                Informasi ini digunakan dalam pesan WhatsApp otomatis dan footer website.
              </p>
            </div>

            {settingsSavedNotice && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan berhasil disimpan ke sistem!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Platform Showcase
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp Koordinator Utama
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.primaryPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, primaryPhone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tagline / Motto Platform
                </label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Bantuan
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rekening Pembayaran Bank
                  </label>
                  <input
                    type="text"
                    value={`${settingsForm.bankName} - ${settingsForm.bankAccount}`}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankAccount: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pengumuman Promo Banner Website
                </label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat Kantor & Gudang Distribusi
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                Simpan Perubahan Pengaturan
              </button>
            </form>
          </div>
        )}

      </main>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-stone-900 mb-4">
              {editingProductId ? 'Edit Data Produk Makanan' : 'Tambah Produk Makanan Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keripik Jamur Tiram Crispy"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  >
                    <option value="snack">Keripik & Cemilan</option>
                    <option value="sambal">Sambal & Bumbu Dapur</option>
                    <option value="lauk">Lauk & Makanan Khas</option>
                    <option value="kue">Kue & Pastry</option>
                    <option value="frozen">Frozen Food Siap Saji</option>
                    <option value="minuman">Minuman Tradisional & Herbal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status Ketersediaan</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  >
                    <option value="ready">Siap Kirim (Ready Stock)</option>
                    <option value="preorder">Pre-Order (PO)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Harga Coret/Promo (Rp)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Satuan Kemasan</label>
                  <input
                    type="text"
                    placeholder="Pouch 250g / Toples"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo URL & Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-400 self-center">Pilihan Contoh Foto:</span>
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan keistimewaan rasa, resep, dan saran penyajian..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Komposisi (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={productForm.ingredientsStr}
                    onChange={(e) => setProductForm({ ...productForm, ingredientsStr: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Masa Simpan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 3 Bulan Suhu Ruang"
                    value={productForm.shelfLife}
                    onChange={(e) => setProductForm({ ...productForm, shelfLife: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Brand UMKM</label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={productForm.producerName}
                    onChange={(e) => setProductForm({ ...productForm, producerName: e.target.value })}
                    className={`w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white ${!isAdmin ? 'opacity-70 cursor-not-allowed bg-stone-100' : ''}`}
                  />
                  {!isAdmin && <span className="text-[10px] text-amber-600 block mt-0.5">Terkunci otomatis ke brand Anda</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kota Asal</label>
                  <input
                    type="text"
                    value={productForm.producerCity}
                    onChange={(e) => setProductForm({ ...productForm, producerCity: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={productForm.producerWa}
                    onChange={(e) => setProductForm({ ...productForm, producerWa: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bestseller-check"
                  checked={productForm.isBestSeller}
                  onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="bestseller-check" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Tandai sebagai Produk Terlaris (Best Seller ⭐)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                {editingProductId ? 'Simpan Perubahan Produk' : 'Terbitkan Produk ke Etalase'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE ORDER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative space-y-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Kelola Pesanan
              </span>
              <h3 className="text-lg font-extrabold text-stone-900 mt-1">
                {selectedOrder.orderNumber}
              </h3>
              <p className="text-xs text-stone-500">
                Waktu Transaksi: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
              </p>
            </div>

            {/* Customer Details Box */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
              <p><strong className="text-stone-800">Nama:</strong> {selectedOrder.customerName}</p>
              <p><strong className="text-stone-800">No. WhatsApp:</strong> {selectedOrder.customerPhone}</p>
              <p><strong className="text-stone-800">Alamat:</strong> {selectedOrder.customerAddress}</p>
              {selectedOrder.customerNotes && (
                <p><strong className="text-stone-800">Catatan Khusus:</strong> <em>{selectedOrder.customerNotes}</em></p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2 border-y border-stone-100 py-3">
              <span className="text-xs font-bold text-stone-700 block">Daftar Barang:</span>
              {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span>{it.quantity}x {it.product?.name || 'Produk Kuliner'} {it.product?.unit ? `(${it.product.unit})` : ''}</span>
                  <span className="font-bold text-stone-900">{formatRupiah((it.priceAtPurchase || it.product?.price || 0) * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100 font-extrabold">
                <span>Total:</span>
                <span className="text-sm text-amber-900">{formatRupiah(selectedOrder.totalPrice)}</span>
              </div>
            </div>

            {/* Update Status & Shipping */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ubah Status Pesanan</label>
                <select
                  value={orderModalStatus}
                  onChange={(e) => setOrderModalStatus(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                >
                  <option value="pending">Menunggu Konfirmasi</option>
                  <option value="processing">Sedang Dikemas / Dimasak</option>
                  <option value="shipped">Dalam Pengiriman (Sudah Ada Resi)</option>
                  <option value="completed">Pesanan Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kurir Pengiriman</label>
                  <input
                    type="text"
                    placeholder="Contoh: JNE YES"
                    value={orderCourier}
                    onChange={(e) => setOrderCourier(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor Resi</label>
                  <input
                    type="text"
                    placeholder="Contoh: JNE882910..."
                    value={orderTracking}
                    onChange={(e) => setOrderTracking(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSaveOrderStatus}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Simpan Status
              </button>
              <button
                onClick={() => handleSendReceiptWA(selectedOrder)}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim WA ke Pembeli</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
