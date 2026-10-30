'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ProductCatalog from '@/components/ProductCatalog';
import UmkmStorySection from '@/components/UmkmStorySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import ProductDetailModal from '@/components/ProductDetailModal';
import OrderDrawer from '@/components/OrderDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import RegisterUmkmModal from '@/components/RegisterUmkmModal';
import { MessageCircle } from 'lucide-react';

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleExploreClick = () => {
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Navigation */}
      <Navbar onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection 
          onExploreClick={handleExploreClick}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />

        {/* Categories Section */}
        <CategorySection />

        {/* Product Catalog */}
        <ProductCatalog />

        {/* About & UMKM Mission Section */}
        <UmkmStorySection />

        {/* Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Modals and Drawers */}
      <ProductDetailModal />
      <OrderDrawer />
      <WishlistDrawer />
      <RegisterUmkmModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />

      {/* Floating Customer Help WhatsApp Pill */}
      <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 right-6 z-30">
        <a
          href="https://wa.me/6281234567801?text=Halo%20Admin%20RasaNusantara,%20saya%20butuh%20bantuan%20terkait%20produk%20kuliner%20UMKM"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs sm:text-sm font-bold group cursor-pointer"
          title="Tanya Admin via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-200 fill-emerald-200 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Tanya Kami di WA</span>
        </a>
      </aside>
    </div>
  );
}
