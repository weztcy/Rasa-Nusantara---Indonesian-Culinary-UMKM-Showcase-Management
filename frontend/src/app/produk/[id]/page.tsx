'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderDrawer from '@/components/OrderDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import RegisterUmkmModal from '@/components/RegisterUmkmModal';
import ProductCard from '@/components/ProductCard';
import { formatRupiah, createWhatsAppDirectLink } from '@/lib/utils';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Heart, 
  MessageCircle, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Check, 
  Store,
  Share2,
  ChevronRight
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setIsCartOpen 
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const product = products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-between">
        <Navbar onOpenRegisterModal={() => setIsRegisterOpen(true)} />
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h2 className="text-xl font-bold text-stone-900">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            Produk makanan yang Anda cari mungkin sudah tidak tersedia atau tautan salah.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        <Footer onOpenRegisterModal={() => setIsRegisterOpen(true)} />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const activeImage = product.gallery?.[activeImageIdx] || product.image;

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, note);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setIsCartOpen(true);
    }, 800);
  };

  const handleDirectWhatsApp = () => {
    const link = createWhatsAppDirectLink(product, quantity);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/60 flex flex-col text-stone-900">
      <Navbar onOpenRegisterModal={() => setIsRegisterOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-amber-700 transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/#katalog" className="hover:text-amber-700 transition">Katalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-700 font-semibold">{product.categoryLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid lg:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  ⭐ Best Seller
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activeImageIdx === i
                        ? 'border-amber-600 ring-2 ring-amber-600/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Producer Information Box */}
            <div className="mt-6 bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                  <Image
                    src={product.producer.avatar}
                    alt={product.producer.owner}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{product.producer.name}</h4>
                  <p className="text-xs text-stone-500">
                    Pemilik: {product.producer.owner} • Est. {product.producer.establishedYear}
                  </p>
                  <p className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{product.producer.city}, {product.producer.province}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-600 italic border-t border-stone-200/60 pt-2.5">
                &quot;{product.producer.story}&quot;
              </p>
            </div>
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Top info badge & Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
                  {product.categoryLabel}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition cursor-pointer"
                    title="Bagikan Produk"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {copiedLink && (
                    <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded">
                      Tersalin!
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 text-stone-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    title="Favorit"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400 font-normal">({product.reviewCount} ulasan)</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600 font-medium">{product.soldCount} Terjual</span>
                {product.spicyLevel && product.spicyLevel > 0 && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-lg">
                      Pedas Level {product.spicyLevel}/5 {'🌶️'.repeat(product.spicyLevel)}
                    </span>
                  </>
                )}
              </div>

              {/* Price Box */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-stone-900">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-stone-400 line-through ml-2">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Estimasi berat kirim: ±{product.weightGram} gram per kemasan
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  Deskripsi Makanan
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Bahan & Racikan Rempah
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-lg">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shelf life & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-800 block">Daya Simpan:</span>
                    <span className="text-stone-600 text-[11px]">{product.shelfLife}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-800 block">Sertifikasi Legal:</span>
                    <span className="text-stone-600 text-[11px] block">{product.certifications[0]}</span>
                  </div>
                </div>
              </div>

              {/* Quantity selector & Notes */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Jumlah Pesanan:</span>
                  <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-stone-700 hover:bg-stone-200 transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-stone-700 hover:bg-stone-200 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Catatan tambahan untuk penjual (opsional)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Subtotal ({quantity} item):</span>
                <span className="text-lg font-black text-amber-900">
                  {formatRupiah(product.price * quantity)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Masuk ke Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ Tambah Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Cepat via WA</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-400">
                ⚡ Transaksi langsung terhubung ke pengrajin tanpa perantara.
              </p>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-extrabold text-stone-900">
              Pilihan Lainnya di Kategori {product.categoryLabel}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer onOpenRegisterModal={() => setIsRegisterOpen(true)} />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <OrderDrawer />
      <WishlistDrawer />
      <RegisterUmkmModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-semibold">Memuat rincian produk kuliner UMKM...</p>
          </div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
