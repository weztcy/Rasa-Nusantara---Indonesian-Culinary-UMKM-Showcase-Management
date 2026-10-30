'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatRupiah, createWhatsAppDirectLink } from '@/lib/utils';
import { 
  Heart, 
  Star, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Eye, 
  Check 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useCart();

  const [addedNotice, setAddedNotice] = React.useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleOpenDetail = () => {
    setSelectedProduct(product);
  };

  const handleWhatsAppDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = createWhatsAppDirectLink(product, 1);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleOpenDetail}
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Product Image Section */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {product.isBestSeller && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              Terlaris
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Hemat {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom image overlay: Origin & Spicy Indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{product.producer.city}</span>
          </div>

          {product.spicyLevel && product.spicyLevel > 0 ? (
            <div className="bg-red-950/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300">
              {'🌶️'.repeat(Math.min(product.spicyLevel, 4))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Producer Name & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-semibold text-amber-800 truncate max-w-[55%]">{product.producer.name}</span>
            <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[10px] border border-amber-200/60">
              {product.categoryLabel || ({
                snack: 'Keripik & Cemilan',
                sambal: 'Sambal & Bumbu',
                lauk: 'Lauk Tradisional',
                kue: 'Kue & Pastry',
                frozen: 'Frozen Food',
                minuman: 'Minuman Herbal'
              }[product.category] || product.category)}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating & Sold count */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <div className="flex items-center gap-1 text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">
              {product.soldCount} terjual
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 font-medium text-[11px]">
              Halal
            </span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-stone-900">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs text-stone-400">/{product.unit}</span>
              </div>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Quick Add to Cart Button */}
            <button
              onClick={handleQuickAdd}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                addedNotice
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 hover:bg-amber-600 text-amber-800 hover:text-white'
              }`}
              title="Tambah ke Keranjang"
              aria-label="Add to cart"
            >
              {addedNotice ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetail();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail</span>
            </button>

            <button
              onClick={handleWhatsAppDirect}
              className="w-full flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
              title="Chat & Pesan Langsung via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pesan WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
