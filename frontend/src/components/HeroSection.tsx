'use client';

import React from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  MapPin, 
  HeartHandshake, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenRegisterModal: () => void;
}

export default function HeroSection({ onExploreClick, onOpenRegisterModal }: HeroSectionProps) {
  const { products } = useCart();

  const stats = [
    {
      value: products.length > 0 ? `${products.length}+` : '37+',
      label: 'Katalog Kuliner Ready',
      subtext: 'Dari Sabang sampai Merauke',
    },
    {
      value: '16+',
      label: 'Mitra Produsen UMKM',
      subtext: 'Dapur & Pengrajin Terverifikasi',
    },
    {
      value: '100%',
      label: 'Halal & P-IRT Terkurasi',
      subtext: 'Legalitas Higienis Terpantau',
    },
    {
      value: '4.9 ★',
      label: 'Rating Kepuasan Konsumen',
      subtext: 'Ulasan Pembeli Riil',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-amber-50/80 via-white to-stone-50/50 pt-8 pb-16 md:py-20 animate-fadeIn">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-slideUp">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Platform Kurasi Produk Kuliner UMKM Terpercaya</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Kelezatan Otentik dari{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-orange-600 to-amber-700">
                Dapur UMKM Nusantara
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Jelajahi keripik renyah, sambal uleg khas daerah, olahan rendang tradisional, hingga kue warisan leluhur. Pesan langsung dengan mudah via WhatsApp ke produsen tangan pertama.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-orange-500/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Jelajahi Katalog Makanan</span>
              </button>

              <button
                onClick={onOpenRegisterModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold px-7 py-3.5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer text-base"
              >
                <HeartHandshake className="w-5 h-5 text-amber-600" />
                <span>Daftar Jadi Mitra UMKM</span>
              </button>
            </div>

            {/* Value Props Row */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left border-t border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">100% Halal</p>
                  <p className="text-[11px] text-stone-500">Izin P-IRT Resmi</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Rasa Otentik</p>
                  <p className="text-[11px] text-stone-500">Resep Asli Daerah</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Tangan Pertama</p>
                  <p className="text-[11px] text-stone-500">Langsung dari Dapur</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Collage / Featured Product Preview */}
          <div className="lg:col-span-5 relative animate-scaleUp">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Feature Card */}
              <div className="relative bg-white p-3 rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=800&q=80"
                    alt="Keripik Tempe Bu Harti"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-amber-600/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                      ⭐ Best Seller
                    </span>
                    <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-medium px-2 py-1 rounded-full shadow-xs">
                      Halal Resmi
                    </span>
                  </div>

                  {/* Card bottom text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-amber-300 font-semibold">Dapur Bu Harti • Malang</p>
                    <h3 className="text-lg font-bold">Keripik Tempe Sanan Daun Jeruk</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-extrabold text-white">Rp 25.000 <span className="text-xs font-normal text-stone-300">/ 200g</span></span>
                      <span className="text-xs bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">1.250+ Terjual</span>
                    </div>
                  </div>
                </div>

                {/* Micro thumbnail row */}
                <div className="mt-3 p-2.5 bg-amber-50/60 rounded-xl flex items-center justify-between text-xs text-stone-600">
                  <span className="font-semibold text-amber-900">🍜 Kuliner Siap Saji & Oleh-Oleh</span>
                  <span className="text-stone-500">Dari 16+ Kota di Nusantara</span>
                </div>
              </div>

              {/* Floating Badge Left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                  🌶️
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Sambal Roa Manado</p>
                  <p className="text-[11px] text-stone-500">Ikan Asap Asli • Pedas Nampol</p>
                </div>
              </div>

              {/* Floating Badge Right */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-stone-100 text-center hover:scale-105 transition-transform">
                <span className="text-xl">🥩</span>
                <p className="text-[11px] font-extrabold text-stone-900 mt-0.5">Rendang 8 Jam</p>
                <p className="text-[10px] text-amber-700 font-bold">Resep Asli Minang</p>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Row */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left bg-white/80 p-4 rounded-2xl border border-stone-100 shadow-2xs hover:shadow-md hover:border-amber-200 transition-all duration-300">
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-amber-700 mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
