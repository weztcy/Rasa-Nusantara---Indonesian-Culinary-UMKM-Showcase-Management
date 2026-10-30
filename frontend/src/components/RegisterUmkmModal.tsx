'use client';

import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Send, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

import { useCart } from '@/context/CartContext';

interface RegisterUmkmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterUmkmModal({ isOpen, onClose }: RegisterUmkmModalProps) {
  const { submitPartner } = useCart();
  const [brandName, setBrandName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [city, setCity] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [category, setCategory] = useState('Keripik & Cemilan');
  const [certification, setCertification] = useState('Sudah Halal & P-IRT');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Register into persistent partner list
    submitPartner({
      brandName,
      ownerName,
      city,
      waNumber,
      category,
      certification,
      description,
    });

    const coordinatorWA = '6281234567801';
    const message = 
      `Halo Tim Kurator RasaNusantara! 🇮🇩\n` +
      `Saya ingin mendaftarkan produk kuliner UMKM saya ke dalam etalase:\n\n` +
      `🏢 *Nama Brand/UMKM:* ${brandName}\n` +
      `👤 *Nama Pemilik:* ${ownerName}\n` +
      `📍 *Kota/Wilayah:* ${city}\n` +
      `📱 *WhatsApp:* ${waNumber}\n` +
      `🍱 *Kategori Produk:* ${category}\n` +
      `📜 *Status Sertifikasi:* ${certification}\n` +
      `📝 *Cerita & Keunggulan Produk:*\n${description}\n\n` +
      `Mohon info tahapan kurasi selanjutnya. Terima kasih! 🙏`;

    const waLink = `https://wa.me/${coordinatorWA}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Pendaftaran Berhasil Dikirim!</h3>
            <p className="text-xs text-stone-600">
              Tim kurator kami akan meninjau kelengkapan produk Anda via WhatsApp dalam 1x24 jam kerja.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
                  Daftarkan Usaha Kuliner Anda
                </h3>
                <p className="text-xs text-stone-500">
                  Gratis kurasi & tampil di etalase produk UMKM se-Indonesia.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Brand/Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sambal Bu Siti"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Pemilik *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Rahmawati"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kota Asal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bandung, Solo, Padang"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    No. WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategori Makanan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  >
                    <option value="Keripik & Cemilan">Keripik & Cemilan</option>
                    <option value="Sambal & Bumbu Dapur">Sambal & Bumbu Dapur</option>
                    <option value="Lauk & Makanan Khas">Lauk & Makanan Khas</option>
                    <option value="Kue & Pastry">Kue & Pastry</option>
                    <option value="Frozen Food">Frozen Food Siap Saji</option>
                    <option value="Minuman Tradisional">Minuman Herbal & Tradisional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status Sertifikasi
                  </label>
                  <select
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                  >
                    <option value="Sudah Halal & P-IRT">Sudah Halal & P-IRT</option>
                    <option value="Baru P-IRT">Baru P-IRT Saja</option>
                    <option value="Sedang Pengurusan Izin">Sedang Pengurusan Izin</option>
                    <option value="Belum Ada (Butuh Pendampingan)">Belum Ada (Butuh Pendampingan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Keunikan Produk & Cerita Resep *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan keistimewaan rasa, bahan baku pilihan, atau tradisi pembuatan produk Anda..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Tidak dipungut biaya pendaftaran. Tim kami akan membantu pembuatan materi showcase dan optimasi etalase online Anda.
                </span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pendaftaran via WhatsApp</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
