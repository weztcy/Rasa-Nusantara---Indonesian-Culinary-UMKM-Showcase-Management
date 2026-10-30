'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatRupiah, createWhatsAppDirectLink } from '@/lib/utils';
import { 
  X, 
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
  Share2
} from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
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

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const activeImage = selectedProduct.gallery?.[activeImageIdx] || selectedProduct.image;

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setNote('');
    setActiveImageIdx(0);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, note);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      handleClose();
      setIsCartOpen(true);
    }, 1000);
  };

  const handleDirectWhatsApp = () => {
    const link = createWhatsAppDirectLink(selectedProduct, quantity);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Dialog */}
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between bg-stone-50/70 border-b md:border-b-0 md:border-r border-stone-100">
          <div>
            {/* Main Photo */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner">
              <Image
                src={activeImage}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover transition-all duration-300"
              />
              {selectedProduct.isBestSeller && (
                <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  ⭐ Best Seller
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
              <div className="flex gap-2 mt-3">
                {selectedProduct.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activeImageIdx === i ? 'border-amber-600 ring-2 ring-amber-600/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Producer Card at bottom of photo */}
          <div className="mt-6 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <Image
                  src={selectedProduct.producer.avatar}
                  alt={selectedProduct.producer.owner}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    {selectedProduct.producer.name}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                    Mitra Terverifikasi
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Pemilik: {selectedProduct.producer.owner} • Est. {selectedProduct.producer.establishedYear}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{selectedProduct.producer.city}, {selectedProduct.producer.province}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-2.5 italic border-t border-stone-100 pt-2 leading-relaxed">
              &quot;{selectedProduct.producer.story}&quot;
            </p>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Header: Category & Share/Wishlist */}
            <div className="flex items-center justify-between pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                {selectedProduct.categoryLabel}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                  title="Bagikan Tautan"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copiedLink && (
                  <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded">
                    Tersalin!
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Simpan Favorit"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
              {selectedProduct.name}
            </h2>

            {/* Rating, Reviews, Spicy */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating.toFixed(1)}</span>
                <span className="text-stone-400 font-normal">({selectedProduct.reviewCount} ulasan)</span>
              </div>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600 font-medium">
                {selectedProduct.soldCount} Terjual
              </span>
              {selectedProduct.spicyLevel && selectedProduct.spicyLevel > 0 && (
                <>
                  <span className="text-stone-400">•</span>
                  <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                    Pedas Level {selectedProduct.spicyLevel}/5 {'🌶️'.repeat(selectedProduct.spicyLevel)}
                  </span>
                </>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {formatRupiah(selectedProduct.price)}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  / {selectedProduct.unit}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xs text-stone-400 line-through ml-2">
                    {formatRupiah(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Estimasi berat kirim: ±{selectedProduct.weightGram} gram per kemasan
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Deskripsi Produk
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Bahan & Komposisi
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Shelf life & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">Masa Simpan:</span>
                  <span className="text-stone-600 text-[11px]">{selectedProduct.shelfLife}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">Sertifikasi Legal:</span>
                  <span className="text-stone-600 text-[11px] block">{selectedProduct.certifications[0]}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Optional Note */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Jumlah Pesanan:</span>
                <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-stone-700 hover:bg-stone-200 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-stone-700 hover:bg-stone-200 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Catatan pesanan (opsional, contoh: minta ekstra bubble wrap)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-amber-500"
              />
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="space-y-2 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
              <span>Subtotal:</span>
              <span className="text-base font-extrabold text-amber-900">
                {formatRupiah(selectedProduct.price * quantity)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition cursor-pointer"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dimasukkan ke Keranjang!</span>
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
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Cepat via WA</span>
              </button>
            </div>
            
            <p className="text-[11px] text-center text-stone-400">
              ⚡ Terhubung langsung dengan produsen ({selectedProduct.producer.name}) tanpa perantara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
