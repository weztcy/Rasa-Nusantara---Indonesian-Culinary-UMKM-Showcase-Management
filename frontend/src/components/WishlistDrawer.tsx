'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/lib/utils';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight 
} from 'lucide-react';

export default function WishlistDrawer() {
  const { 
    products,
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    addToCart, 
    setSelectedProduct 
  } = useCart();

  if (!isWishlistOpen) return null;

  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Produk Favorit Saya
              </h3>
              <p className="text-xs text-stone-500">
                {favoritedProducts.length} produk tersimpan
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200 transition cursor-pointer"
            aria-label="Tutup wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {favoritedProducts.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                ❤️
              </div>
              <h4 className="font-bold text-stone-800 text-base">Belum Ada Produk Favorit</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Klik ikon hati pada produk makanan yang menarik minat Anda untuk menyimpannya di sini.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-5 inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                <span>Lihat Katalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            favoritedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-stone-50/70 rounded-2xl border border-stone-200/80 items-center"
              >
                <div 
                  className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsWishlistOpen(false);
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-800">
                    {product.producer.name}
                  </span>
                  <h5 
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="font-bold text-xs text-stone-900 truncate hover:text-amber-700 cursor-pointer"
                  >
                    {product.name}
                  </h5>
                  <p className="text-xs font-extrabold text-stone-800 mt-0.5">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                    }}
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition cursor-pointer text-xs"
                    title="Tambah ke Keranjang"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition cursor-pointer"
                    title="Hapus dari favorit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoritedProducts.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50/50">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full text-center text-xs font-semibold text-stone-600 hover:text-stone-900 py-2"
            >
              Tutup & Lanjut Belanja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
