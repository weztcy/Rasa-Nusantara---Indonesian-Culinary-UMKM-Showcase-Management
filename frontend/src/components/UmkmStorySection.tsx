'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CookingPot, 
  ShieldCheck, 
  HeartHandshake, 
  MessageCircle, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const UMKM_ADVANTAGES = [
  {
    title: 'Resep Asli Warisan Nusantara',
    description: 'Setiap produk dimasak dengan resep turun-temurun asli daerah, menjaga keaslian rasa dan aroma tradisional.',
    icon: 'CookingPot'
  },
  {
    title: '100% Bahan Alami & Bersertifikat',
    description: 'Tanpa pengawet kimia berbahaya. Semua produk terverifikasi Halal dan terdaftar sertifikasi P-IRT / BPOM.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Dukung Langsung Ekonomi Keluarga Petani & Pengrajin',
    description: 'Setiap transaksi Anda berdampak langsung pada kesejahteraan ribuan keluarga pelaku usaha mikro di daerah.',
    icon: 'HeartHandshake'
  },
  {
    title: 'Pesan Mudah Langsung via WhatsApp',
    description: 'Terhubung langsung dengan produsen tanpa ribet, bebas konsultasi varian, tanggal produksi, dan opsi pengiriman.',
    icon: 'MessageCircle'
  }
];

const ICON_MAP: Record<string, React.ReactNode> = {
  CookingPot: <CookingPot className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6" />,
  MessageCircle: <MessageCircle className="w-6 h-6" />,
};

export default function UmkmStorySection() {
  return (
    <section id="tentang-umkm" className="py-16 sm:py-20 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual & Story Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md pt-4 sm:pt-6">
              
              {/* Primary Image */}
              <div className="relative h-88 sm:h-96 md:h-[400px] w-full rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Dapur Tradisional UMKM"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white z-10">
                  <span className="inline-block text-[11px] font-bold bg-amber-500/95 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                    Dapur Komunitas
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-xs">
                    Dari Tangan Pengrajin ke Meja Makan Anda
                  </h4>
                  <p className="text-xs text-stone-200 mt-1 leading-relaxed drop-shadow-xs">
                    Melestarikan warisan rasa tradisional Indonesia dengan standar kebersihan modern.
                  </p>
                </div>
              </div>

              {/* Floating Testimonial Pill at Top-Right (No overlap with bottom text) */}
              <div className="absolute top-2 right-2 sm:-top-5 sm:-right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-200 max-w-[270px] sm:max-w-xs z-20 animate-float">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-stone-900">Berdampak Nyata</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-normal">
                  100% laba penjualan produk langsung diterima oleh UMKM tanpa potongan biaya listing.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Values & Advantages */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nilai & Komitmen Kami</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Mengapa Berbelanja di Etalase Kuliner UMKM Ini?
              </h2>
              <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
                Kami hadir sebagai jembatan bagi produsen makanan rumahan, pengrajin bumbu, dan pembuat camilan tradisional di berbagai pelosok daerah untuk menjangkau penikmat kuliner di seluruh Indonesia.
              </p>
            </div>

            {/* Feature List Cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {UMKM_ADVANTAGES.map((adv, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 hover:bg-amber-50/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    {ICON_MAP[adv.icon] || <CookingPot className="w-5 h-5" />}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">
                    {adv.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote Footer */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
              <span className="text-2xl">🇮🇩</span>
              <p className="text-xs font-medium text-amber-950">
                &quot;Setiap gigitan keripik atau suapan sambal yang Anda beli adalah dukungan konkret bagi kemandirian ekonomi keluarga pengrajin kuliner lokal.&quot;
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
