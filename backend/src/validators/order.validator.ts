import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Nama pemesan minimal 2 karakter'),
  customerPhone: z.string().min(8, 'Nomor telepon/WhatsApp minimal 8 digit'),
  customerAddress: z.string().min(5, 'Alamat pengiriman minimal 5 karakter'),
  customerNotes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID wajib diisi'),
      quantity: z.number().int().positive('Jumlah harus minimal 1'),
      note: z.string().optional(),
    })
  ).min(1, 'Pesanan harus berisi minimal 1 produk'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED']),
  shippingCourier: z.string().optional(),
  trackingNumber: z.string().optional(),
});
