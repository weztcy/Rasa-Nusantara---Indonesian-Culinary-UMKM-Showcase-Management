import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RasaNusantara | Showcase Produk Makanan UMKM Indonesia',
  description:
    'Etalase kurasi kuliner otentik UMKM Indonesia: Keripik, Sambal, Rendang, Pempek, Kue Tradisional, dan Minuman Herbal. Dukung pengrajin lokal dan pesan langsung via WhatsApp.',
  keywords: [
    'UMKM Kuliner',
    'Makanan Khas Nusantara',
    'Oleh-oleh Daerah',
    'Keripik Tempe Malang',
    'Sambal Roa Manado',
    'Rendang Minang',
    'Pempek Palembang',
    'Lapis Legit',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
