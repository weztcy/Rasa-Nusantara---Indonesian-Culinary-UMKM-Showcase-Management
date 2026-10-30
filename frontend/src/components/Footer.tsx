'use client';

import React from 'react';
import { Store, Heart, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onOpenRegisterModal: () => void;
}

export default function Footer({ onOpenRegisterModal }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Rasa<span className="text-amber-500">Nusantara</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Platform showcase kurasi produk makanan dan minuman otentik UMKM Indonesia. Mempertemukan pencinta kuliner nusantara langsung dengan para ibu dan pengrajin lokal tangan pertama.
            </p>

            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://wa.me/6281234567801" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition" aria-label="WhatsApp">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#" className="hover:text-amber-400 transition">Beranda</a></li>
              <li><a href="#katalog" className="hover:text-amber-400 transition">Katalog Makanan</a></li>
              <li><a href="#kategori" className="hover:text-amber-400 transition">Kategori Pilihan</a></li>
              <li><a href="#tentang-umkm" className="hover:text-amber-400 transition">Cerita Pengrajin</a></li>
              <li><a href="#testimoni" className="hover:text-amber-400 transition">Ulasan Pembeli</a></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Kategori Kuliner</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#katalog" className="hover:text-amber-400 transition">Keripik & Camilan Renyah</a></li>
              <li><a href="#katalog" className="hover:text-amber-400 transition">Sambal & Bumbu Dapur</a></li>
              <li><a href="#katalog" className="hover:text-amber-400 transition">Lauk Tradisional Siap Saji</a></li>
              <li><a href="#katalog" className="hover:text-amber-400 transition">Kue Basah & Kering</a></li>
              <li><a href="#katalog" className="hover:text-amber-400 transition">Jamu & Minuman Herbal</a></li>
            </ul>
          </div>

          {/* Mitra UMKM & Contact Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Kemitraan UMKM</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Punya usaha kuliner rumahan dan ingin produk Anda tampil di etalase ini?
            </p>
            <button
              onClick={onOpenRegisterModal}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer shadow-xs"
            >
              Daftar Jadi Mitra Gratis
            </button>
            <div className="mt-4 space-y-1.5 text-stone-400 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>halo@rasanusantara.id</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Jakarta & Yogyakarta, Indonesia</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Logistics and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-stone-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk memajukan UMKM Kuliner Indonesia.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>© 2026 RasaNusantara. Hak Cipta Dilindungi.</span>
            <span>•</span>
            <a href="#" className="hover:text-stone-300">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-stone-300">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
