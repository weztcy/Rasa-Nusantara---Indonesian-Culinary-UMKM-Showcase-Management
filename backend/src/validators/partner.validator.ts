import { z } from 'zod';

export const createPartnerSubmissionSchema = z.object({
  brandName: z.string().min(2, 'Nama brand/usaha minimal 2 karakter'),
  ownerName: z.string().min(2, 'Nama pemilik minimal 2 karakter'),
  city: z.string().min(2, 'Kota/wilayah minimal 2 karakter'),
  waNumber: z.string().min(8, 'Nomor WhatsApp minimal 8 digit'),
  category: z.string().min(2, 'Kategori makanan wajib diisi'),
  certification: z.string().min(2, 'Status sertifikasi wajib diisi'),
  description: z.string().min(10, 'Cerita & keunggulan produk minimal 10 karakter'),
});

export const updatePartnerStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});
