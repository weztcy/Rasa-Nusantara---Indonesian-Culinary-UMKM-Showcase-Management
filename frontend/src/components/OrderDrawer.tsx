'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatRupiah, createWhatsAppCartOrderLink } from '@/lib/utils';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function OrderDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    createOrder 
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderSuccessNumber, setOrderSuccessNumber] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.product.weightGram || 200) * item.quantity, 0);

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerAddress.trim()) {
      alert('Mohon lengkapi Nama dan Alamat Pengiriman agar penjual dapat menghitung ongkir.');
      return;
    }

    // Save order into global dashboard state
    const createdOrder = createOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerNotes,
      items: [...cart],
    });

    const waLink = createWhatsAppCartOrderLink(cart, {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      notes: customerNotes,
    });

    window.open(waLink, '_blank', 'noopener,noreferrer');

    setOrderSuccessNumber(createdOrder.orderNumber);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Keranjang Pesanan UMKM
              </h3>
              <p className="text-xs text-stone-500">
                {cart.length} jenis produk dipilih
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200 transition cursor-pointer"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {orderSuccessNumber ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h4 className="font-extrabold text-stone-900 text-xl">
                Pesanan Berhasil Dikirim!
              </h4>
              <p className="text-xs text-stone-500">
                Pesan telah diteruskan ke WhatsApp resmi penjual. Pesanan Anda juga telah dicatat di sistem portal toko.
              </p>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-1.5">
                <p className="text-[11px] text-stone-400">ID Pesanan:</p>
                <p className="text-sm font-mono font-bold text-amber-800">{orderSuccessNumber}</p>
                <p className="text-[11px] text-stone-400 pt-1">Atas Nama: <span className="text-stone-800 font-semibold">{customerName}</span></p>
              </div>
              <button
                onClick={() => {
                  setOrderSuccessNumber(null);
                  setShowCheckoutForm(false);
                  setIsCartOpen(false);
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Tutup & Kembali Belanja
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 text-3xl">
                🛒
              </div>
              <h4 className="font-bold text-stone-800 text-lg">Keranjang Masih Kosong</h4>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs mx-auto">
                Yuk jelajahi aneka keripik, sambal, dan hidangan tradisional khas UMKM kami!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !showCheckoutForm ? (
            /* Item List View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Daftar Produk:</span>
                <button
                  onClick={clearCart}
                  className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-stone-50/70 rounded-2xl border border-stone-200/80 items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-amber-800 truncate">
                      {item.product.producer.name}
                    </p>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-xs font-extrabold text-stone-800 mt-0.5">
                      {formatRupiah(item.product.price)}
                    </p>
                    {item.note && (
                      <p className="text-[10px] text-stone-400 italic mt-0.5">
                        Catatan: {item.note}
                      </p>
                    )}
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Weight indicator */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-900">
                <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Estimasi Total Berat: <strong>{(totalWeight / 1000).toFixed(2)} kg</strong>
                </span>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form id="checkout-form" onSubmit={handleSendWhatsAppOrder} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-800">
                  Data Pengiriman Pesanan:
                </span>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
                >
                  ← Kembali ke Item
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp Penerima *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jalan, No Rumah, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mohon dipacking kardus tebal untuk hadiah"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 bg-stone-50"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Pesanan akan langsung diteruskan ke WhatsApp resmi penjual dengan rincian yang rapi. Tanpa potongan komisi aplikasi!
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-600">Subtotal Belanja:</span>
              <span className="text-xl font-extrabold text-stone-900">
                {formatRupiah(totalPrice)}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              * Ongkos kirim dihitung langsung oleh mitra UMKM sesuai kurir pilihan Anda (JNE, J&T, SiCepat, Paxel).
            </p>

            {!showCheckoutForm ? (
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                <span>Lanjut Isi Alamat Pengiriman</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Kirim Pesanan ke WhatsApp UMKM</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
