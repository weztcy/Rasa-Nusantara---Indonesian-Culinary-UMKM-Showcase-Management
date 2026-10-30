// DEPRECATED & PURGED: Seluruh data aplikasi 100% menggunakan REST API backend MySQL Laragon.
// File ini dikosongkan agar tidak ada data tiruan/dummy yang tertinggal dalam bundle.

import { Product, CategoryOption, Order, PartnerSubmission, StoreSettings } from '@/types/product';

export const CATEGORIES: CategoryOption[] = [];
export const PRODUCTS: Product[] = [];
export const TESTIMONIALS: any[] = [];
export const STATS: any[] = [];
export const UMKM_ADVANTAGES: any[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_PARTNERS: PartnerSubmission[] = [];
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'RasaNusantara UMKM',
  tagline: 'Etalase Kuliner Otentik & Pemberdayaan Usaha Mikro Indonesia',
  primaryPhone: '6281234567801',
  email: 'halo@rasanusantara.id',
  address: 'Jl. Malioboro No. 45, D.I. Yogyakarta & Smesco Indonesia Jakarta',
  bankAccount: '137-00-1928371-2',
  bankName: 'Bank Mandiri',
  bankHolder: 'Koperasi Mitra UMKM Nusantara',
  announcement: 'Gratis ongkir untuk pengiriman sesama pulau Jawa dengan minimal order Rp 150.000!'
};
