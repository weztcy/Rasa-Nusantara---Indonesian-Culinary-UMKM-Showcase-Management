'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 'testi-01',
    name: 'Anindya Putri',
    city: 'Jakarta Selatan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    comment: 'Keripik tempe Sanan dan sambal roanya juara banget! Renyahnya tahan lama dan ikannya berasa banget. Praktis pesan via WA, penjualnya ramah.',
    productName: 'Keripik Tempe Sanan & Sambal Roa',
    rating: 5,
  },
  {
    id: 'testi-02',
    name: 'Dimas Wicaksono',
    city: 'Surabaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    comment: 'Rendang Uni Nel beneran otentik Minang! Bumbunya pekat meresap sampai ke serat daging terdalam. Kemasan vacuumnya aman banget dikirim antar pulau.',
    productName: 'Rendang Daging Sapi Dapur Uni Nel',
    rating: 5,
  },
  {
    id: 'testi-03',
    name: 'Clarissa Maharani',
    city: 'Bandung',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    comment: 'Senang banget ada platform yang beneran ngumpulin UMKM kuliner tangan pertama gini. Pempek dan bakpianya masih fresh banget pas sampai rumah.',
    productName: 'Paket Pempek Komplit & Bakpia Basah',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="py-16 sm:py-20 bg-stone-50/70 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-slideUp">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            Pengalaman Pelanggan
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Kata Mereka yang Sudah Menikmati
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Kepuasan pelanggan dari berbagai kota yang telah mencicipi kuliner otentik mitra UMKM kami.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-200" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                  &quot;{item.comment}&quot;
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-200 shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {item.city} • <span className="text-amber-700 font-medium">{item.productName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
