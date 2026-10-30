import { CartItem, Product } from '@/types/product';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function createWhatsAppDirectLink(product: Product, quantity: number = 1): string {
  const waNumber = product.producer.waNumber.replace(/[^0-9]/g, '');
  const total = product.price * quantity;
  
  const message = `Halo ${product.producer.name}! 👋\nSaya melihat produk Anda di website *Katalog UMKM Kuliner* dan berminat memesan:\n\n` +
    `📦 *Produk:* ${product.name}\n` +
    `🔢 *Jumlah:* ${quantity} ${product.unit}\n` +
    `💰 *Perkiraan Harga:* ${formatRupiah(total)}\n\n` +
    `Apakah stok masih tersedia? Mohon info ongkir dan cara pembayarannya. Terima kasih! 🙏`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppCartOrderLink(
  items: CartItem[],
  customerInfo: { name: string; phone: string; address: string; notes?: string }
): string {
  if (items.length === 0) return '#';

  // We can send to the first vendor or platform coordinator WA
  const primaryPhone = items[0]?.product.producer.waNumber.replace(/[^0-9]/g, '') || '6281234567801';
  
  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalWeight = items.reduce((acc, item) => acc + (item.product.weightGram || 200) * item.quantity, 0);

  const itemsList = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   - Jumlah: ${item.quantity} ${item.product.unit}\n   - Subtotal: ${formatRupiah(item.product.price * item.quantity)}${item.note ? `\n   - Catatan: ${item.note}` : ''}`
    )
    .join('\n\n');

  const message = `Halo Admin Mitra UMKM Kuliner! 🛍️\nSaya ingin memesan produk-produk berikut:\n\n` +
    `📋 *RINCIAN PESANAN:*\n` +
    `${itemsList}\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💵 *Total Belanja:* ${formatRupiah(totalPrice)}\n` +
    `⚖️ *Perkiraan Berat:* ${(totalWeight / 1000).toFixed(2)} kg\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `👤 *DATA PEMESAN:*\n` +
    `- Nama: ${customerInfo.name || '-'}\n` +
    `- No. WhatsApp: ${customerInfo.phone || '-'}\n` +
    `- Alamat Pengiriman: ${customerInfo.address || '-'}\n` +
    (customerInfo.notes ? `- Catatan Tambahan: ${customerInfo.notes}\n` : '') +
    `\nMohon konfirmasi ketersediaan dan total ongkos kirim. Terima kasih! 🙏`;

  return `https://wa.me/${primaryPhone}?text=${encodeURIComponent(message)}`;
}
