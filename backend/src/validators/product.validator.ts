import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  categoryId: z.string().min(1, 'Kategori produk wajib dipilih'),
  price: z.number().positive('Harga produk harus berupa angka positif'),
  originalPrice: z.number().positive('Harga diskon harus positif').optional().nullable(),
  unit: z.string().min(1, 'Satuan kemasan wajib diisi'),
  weightGram: z.number().int().positive().default(200),
  image: z.string().url('URL gambar produk tidak valid'),
  gallery: z.array(z.string().url()).optional(),
  description: z.string().min(10, 'Deskripsi produk minimal 10 karakter'),
  ingredients: z.array(z.string()).min(1, 'Minimal cantumkan 1 bahan/komposisi'),
  shelfLife: z.string().min(2, 'Daya tahan simpan wajib diisi'),
  spicyLevel: z.number().int().min(0).max(5).default(0),
  certifications: z.array(z.string()).default([]),
  producerId: z.string().optional(),
  producer: z.object({
    name: z.string().min(2, 'Nama brand produsen wajib diisi'),
    owner: z.string().min(2, 'Nama pemilik produsen wajib diisi'),
    city: z.string().min(2, 'Kota produsen wajib diisi'),
    province: z.string().min(2, 'Provinsi produsen wajib diisi'),
    waNumber: z.string().min(8, 'Nomor WhatsApp produsen wajib diisi'),
    story: z.string().default(''),
    avatar: z.string().url().optional(),
    establishedYear: z.number().int().default(2020),
  }).optional(),
  isBestSeller: z.boolean().default(false),
  stockStatus: z.enum(['ready', 'preorder']).default('ready'),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const queryProductSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['popular', 'rating', 'price-asc', 'price-desc', 'newest']).optional(),
  bestSeller: z.enum(['true', 'false']).optional(),
  discountOnly: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});
