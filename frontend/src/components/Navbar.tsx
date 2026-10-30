'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Store,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  onOpenRegisterModal: () => void;
}

export default function Navbar({ onOpenRegisterModal }: NavbarProps) {
  const { 
    cart, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery 
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Smooth scroll to catalog if user types
    if (e.target.value.trim().length > 0) {
      const catalogEl = document.getElementById('katalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs transition-all">
      {/* Top Banner Notice */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Gerakan 100% Cinta Produk Kuliner UMKM Lokal Indonesia</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-amber-100 text-[11px]">
            <span>✨ Terverifikasi Halal & Higienis</span>
            <span>📦 Pengiriman Aman se-Nusantara</span>
            <button 
              onClick={onOpenRegisterModal}
              className="text-white underline hover:text-amber-200 transition font-semibold cursor-pointer"
            >
              Gabung Jadi Mitra UMKM
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                  Rasa<span className="text-amber-600">Nusantara</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  UMKM
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">Etalase Makanan Otentik Daerah</p>
            </div>
          </a>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari keripik, sambal roa, rendang, kue..."
                className="w-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-900 pl-10 pr-4 py-2.5 rounded-full border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition outline-hidden"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            <a href="#katalog" className="hover:text-amber-600 transition-colors">Katalog Produk</a>
            <a href="#kategori" className="hover:text-amber-600 transition-colors">Kategori</a>
            <a href="#tentang-umkm" className="hover:text-amber-600 transition-colors">Cerita Mitra</a>
            <a href="#testimoni" className="hover:text-amber-600 transition-colors">Ulasan</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
              title="Produk Favorit"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Portal Dashboard Button */}
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-800 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-full transition cursor-pointer"
              title="Portal Dashboard Admin & Mitra"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>

            {/* Cart / WhatsApp Order Drawer Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-full font-medium text-sm shadow-sm hover:shadow-md transition cursor-pointer group"
              aria-label="Keranjang Pesanan"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Pesanan WA</span>
              {totalCartItems > 0 && (
                <span className="bg-white text-amber-700 text-xs font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 lg:hidden hover:bg-stone-100 rounded-lg transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari produk UMKM..."
              className="w-full bg-stone-100 text-stone-900 pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-amber-600"
          >
            🍱 Jelajahi Produk
          </a>
          <a
            href="#kategori"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-amber-600"
          >
            🏷️ Kategori Pilihan
          </a>
          <a
            href="#tentang-umkm"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-amber-600"
          >
            🌾 Cerita Pengrajin UMKM
          </a>
          <a
            href="#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-amber-600"
          >
            ⭐ Ulasan Pembeli
          </a>
          <a
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-800 font-bold hover:text-amber-600"
          >
            📊 Portal Dashboard Admin / Mitra
          </a>
          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterModal();
              }}
              className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold py-2.5 rounded-xl text-center shadow-xs cursor-pointer"
            >
              Daftarkan Produk UMKM Anda
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
