import { z } from 'zod';

export const updateStoreSettingsSchema = z.object({
  storeName: z.string().min(2, 'Nama platform minimal 2 karakter').optional(),
  tagline: z.string().optional(),
  primaryPhone: z.string().min(8, 'Nomor WhatsApp minimal 8 digit').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  address: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  bankHolder: z.string().optional(),
  announcement: z.string().optional(),
});
