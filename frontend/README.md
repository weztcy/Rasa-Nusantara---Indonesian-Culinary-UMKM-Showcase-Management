# 🌐 Frontend RasaNusantara - Etalase Kuliner & Dashboard UMKM

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)

Aplikasi web modern berbasis **Next.js 16 (App Router)**, **React 19**, dan **Tailwind CSS v4** yang berfungsi ganda sebagai **etalase publik (*Customer Showcase*)** produk kuliner otentik UMKM nusantara dan **portal dashboard manajemen bisnis (*Admin & Vendor Portal*)**.

> ⚡ **Zero Dummy Data**: Seluruh data katalog makanan, kategori, keranjang belanja, pesanan, dan verifikasi mitra dimuat **100% secara real-time dari REST API backend**. Tidak ada data dummy yang tertinggal dalam bundle frontend.

---

## 📌 Daftar Isi
1. [Tentang Frontend (Ini Project Apa?)](#-tentang-frontend-ini-project-apa)
2. [Fitur-Fitur Frontend](#-fitur-fitur-frontend)
3. [Peran Pengguna & Hak Akses (User Roles)](#-peran-pengguna--hak-akses-user-roles)
4. [Kredensial Login Seeder](#-kredensial-login-seeder)
5. [Alur Interaksi Pengguna (User Flows)](#-alur-interaksi-pengguna-user-flows)
6. [Arsitektur Komunikasi API & Docker Network](#-arsitektur-komunikasi-api--docker-network)
7. [Variabel Lingkungan (Environment Variables)](#-variabel-lingkungan-environment-variables)
8. [Cara Menjalankan Frontend](#-cara-menjalankan-frontend)
9. [Struktur Direktori Frontend](#-struktur-direktori-frontend)

---

## 💡 Tentang Frontend (Ini Project Apa?)

Aplikasi frontend ini dirancang untuk memberikan pengalaman berbelanja makanan khas daerah yang elegan, transparan, dan mudah digunakan oleh konsumen umum, sekaligus menyediakan sistem operasional toko bagi pelaku usaha mikro.

### Nilai Utama:
- **Etalase Interaktif**: Pengunjung dapat menelusuri 37+ produk kuliner dari 16+ kota di Indonesia dengan foto berkualitas tinggi, legalitas P-IRT & Halal resmi, dan komposisi rempah alami.
- **Pemesanan WhatsApp Dua Jalur**:
  1. *Quick Order*: Satu klik chat langsung ke nomor WhatsApp penjual untuk 1 produk.
  2. *Multi-Item Cart*: Mengumpulkan produk dari berbagai UMKM ke dalam keranjang belanja, menghitung berat total (kg), formulir alamat pengiriman, dan menghasilkan ID pesanan unik yang otomatis tercatat ke database.
- **Portal Terpadu Berbasis Peran (*Role-Based*)**:
  - Super Admin mengelola seluruh mitra di Indonesia.
  - Mitra UMKM hanya melihat dan mengelola produk serta pesanan miliknya sendiri.

---

## ✨ Fitur-Fitur Frontend

### 1. Etalase Depan (Customer Showcase - `/`)
- **Hero Section**: Headline visual menarik, statistik ringkas (*37+ Produk, 16+ Kota, 15.000+ Pesanan Terkirim*), tombol CTA langsung ke katalog dan modal pendaftaran mitra.
- **Kategori Dinamis**: Menampilkan 6 kategori (*Keripik & Cemilan, Sambal & Bumbu, Lauk & Makanan Khas, Kue & Pastry, Frozen Food, Minuman Tradisional*) yang menghitung stok produk riil langsung dari API database MySQL.
- **Katalog Produk dengan Multi-Filter**:
  - Filter kategori instan tanpa reload halaman.
  - Pencarian fleksibel berdasarkan nama makanan, asal kota, atau bahan rempah.
  - Filter cepat: *Semua*, *Best Seller*, dan *Promo / Diskon*.
  - Sorting: *Paling Populer*, *Harga Terendah*, *Harga Tertinggi*, *Rating Tertinggi*, dan *Terbaru*.
- **Pagination Interaktif**:
  - Pilihan jumlah produk per halaman: **8, 12, 16, atau 24**.
  - Navigasi halaman angka, tombol *Sebelumnya*, dan *Berikutnya*.
  - Otomatis melakukan *smooth-scroll* kembali ke atas katalog saat berpindah halaman.
- **Halaman Detail Produk (`/produk/[id]`)**:
  - Galeri foto makanan resolusi tinggi.
  - Rincian berat gramatur, masa simpan, nomor P-IRT, dan sertifikat Halal Indonesia.
  - Komposisi bahan rempah lengkap dan cerita profil dapur UMKM pembuatnya.
  - Tombol pesan langsung via WhatsApp.
- **Keranjang Belanja Multi-Item (Cart Drawer)**:
  - Mengelola kuantitas pesanan, catatan varian pedas/kemasan.
  - Kalkulasi total berat belanjaan (gram & kilogram) untuk estimasi ongkos kirim.
  - Formulir nama, telepon, dan alamat tujuan pengiriman.
  - Checkout WhatsApp resmi yang otomatis menyimpan data transaksi ke database backend.
- **Drawer Wishlist**: Simpan makanan favorit di browser tanpa perlu registrasi akun.
- **Modal Pendaftaran Mitra**: Form pendaftaran bagi UMKM baru yang langsung mengirim data ke antrean database admin.
- **Cerita UMKM & Nilai Keunggulan**: Tampilan estetis dengan card melayang di kanan atas yang proporsional dan tidak menutupi teks gambar.

### 2. Portal Dashboard Admin & Mitra (`/admin`)
- **Metrik Bisnis**: Ringkasan omzet estimasi penjualan, jumlah pesanan baru, produk aktif, dan mitra terdaftar.
- **Manajemen Produk (CRUD Penuh)**:
  - Tambah produk baru dengan input nama, kategori, harga normal, harga diskon, foto URL, status stok (*Ready / PO*), komposisi, dan izin edar.
  - Edit dan hapus produk dengan sinkronisasi instan ke etalase utama.
  - Tabel produk dilengkapi badge kategori berwarna dan emoji ikon (`🍪`, `🌶️`, `🍲`, `🧁`, `❄️`, `☕`).
- **Kelola Pesanan & Resi Pengiriman**:
  - Filter status pesanan (*Menunggu Konfirmasi, Sedang Dikemas, Dikirim, Selesai, Dibatalkan*).
  - Modal update status, input kurir ekspedisi (JNE, Paxel, SiCepat), dan nomor resi.
  - **Tombol WhatsApp Notifikasi Pembeli**: Mengirimkan update status resmi dan nomor resi pengiriman langsung ke nomor WhatsApp pembeli!
- **Verifikasi Kemitraan UMKM (Khusus Super Admin)**:
  - Antrean pendaftaran brand baru dari website.
  - **Tombol Terima (Approve)**: Menyetujui kemitraan dan mengaktifkan katalog produk.
  - **Tombol Tolak (Reject)**: Menolak pengajuan yang belum memenuhi legalitas/standar rasa.
  - **Tombol Hubungi WA**: Menghubungi pemilik usaha untuk koordinasi sampel.
- **Pengaturan Profil Toko (Khusus Super Admin)**:
  - Mengubah kontak WhatsApp pengelola, email, rekening bank, alamat gudang, dan banner pengumuman.

### 3. Halaman Login Bersih (`/login`)
- Desain card lebar (`sm:max-w-xl`) yang rapi dan elegan.
- Animasi scale-up Tailwind CSS yang halus saat halaman dimuat.
- Validasi autentikasi terhubung langsung ke endpoint `/api/auth/login` (password salah akan memunculkan notifikasi error interaktif).

---

## 👥 Peran Pengguna & Hak Akses (User Roles)

Frontend menerapkan pembatasan hak akses antarmuka (*Interface Guards*):

1. **Pengunjung / Pelanggan (Public)**:
   - Akses penuh ke etalase utama, katalog, detail produk, keranjang belanja, checkout WhatsApp, dan pengajuan form kemitraan.
   - Tidak dapat mengakses portal `/admin`.
2. **Mitra UMKM (Vendor)**:
   - Dapat login ke portal `/admin`.
   - Mengelola produk milik tokonya sendiri.
   - Memantau pesanan yang masuk ke tokonya dan mengirim resi ke pembeli.
   - Menu verifikasi mitra dan pengaturan toko **disembunyikan** demi kerahasiaan usaha.
3. **Super Admin (Pusat RasaNusantara)**:
   - Akses penuh ke seluruh menu di `/admin`.
   - Mengelola semua produk dari seluruh mitra di Indonesia.
   - Memantau omzet gabungan nasional dan semua pesanan.
   - Memiliki wewenang eksklusif untuk **Menerima (Approve)** atau **Menolak (Reject)** pendaftaran mitra baru.
   - Mengubah profil dan rekening bank toko pusat.

---

## 🔐 Kredensial Login Seeder

| Peran (Role) | Brand / Asal | Email Login | Password | Wewenang Khusus |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Pusat RasaNusantara | `admin@rasanusantara.id` | `admin123` | Akses Penuh (Semua Produk, Semua Pesanan, Verifikasi Mitra, Pengaturan) |
| **Mitra UMKM** | Dapur Bu Harti (Malang) | `buharti@malang.id` | `mitra123` | Akses Toko Bu Harti (Khusus produk tempe & pesanan terkait) |
| **Mitra UMKM** | Rendang Uni Nel (Bukittinggi) | `uninel@bukittinggi.id` | `mitra123` | Akses Toko Uni Nel (Khusus produk rendang & pesanan terkait) |
| **Mitra UMKM** | Pempek Cek Mey (Palembang) | `cekmey@palembang.id` | `mitra123` | Akses Toko Cek Mey (Khusus produk pempek & pesanan terkait) |

---

## 🔄 Alur Interaksi Pengguna (User Flows)

### Alur Checkout Belanja:
```
1. Pelanggan memilih produk di katalog
2. Membuka detail produk atau menambahkan ke Keranjang Belanja
3. Membuka Cart Drawer -> mengisi nama, telepon, dan alamat lengkap
4. Menekan tombol "Pesan Sekarang via WhatsApp"
5. Frontend memanggil API POST /api/orders (pesanan tersimpan di MySQL)
6. WhatsApp Web/App otomatis terbuka dengan draf pesan pesanan terstruktur
7. Penjual menerima order di Dashboard -> mengemas -> mengupdate resi kurir
```

---

## 🌐 Arsitektur Komunikasi API & Docker Network

Frontend berkomunikasi dengan backend melalui **nama service Docker (`backend`)**, bukan `localhost`:

```
┌─────────────────────────────────┐
│        Browser Pengunjung       │
└────────────────┬────────────────┘
                 │ Request: /api/products (Relative URL)
                 ▼
┌─────────────────────────────────┐
│     Next.js Server Container    │
│  (next.config.ts Rewrites)      │
└────────────────┬────────────────┘
                 │ Forward: http://backend:5000/api/products
                 ▼ (Docker Network: rasanusantara-network)
┌─────────────────────────────────┐
│     Express Backend Container   │
│     (Port Internal 5000)        │
└─────────────────────────────────┘
```

- Pada file [`next.config.ts`](file:///c:/Users/yohan/Documents/antigravity/charming-shannon/frontend/next.config.ts), fitur reverse proxy `rewrites` mengarahkan rute `/api/:path*` ke `${process.env.INTERNAL_API_URL || 'http://backend:5000'}/api/:path*`.
- Browser pengguna memanggil `/api/*` pada origin frontend (port 3000), sehingga **terbebas dari masalah CORS**.
- Next.js server bertindak sebagai proxy dan meneruskan permintaan secara internal melalui Docker Network ke nama service `backend`.

---

## ⚙️ Variabel Lingkungan (Environment Variables)

File konfigurasi di folder `frontend`:

| Variabel | Default | Deskripsi |
| :--- | :--- | :--- |
| `INTERNAL_API_URL` | `http://backend:5000` | URL service backend di dalam Docker Network (digunakan server Next.js untuk proxy rewrite) |
| `NEXT_PUBLIC_API_URL` | `/api` | Base URL pemanggilan API dari browser client (default menggunakan relative path) |
| `PORT` | `3000` | Port listen server Next.js |
| `NODE_ENV` | `production` / `development` | Mode lingkungan runtime |

---

## 🚀 Cara Menjalankan Frontend

### Opsi 1: Menjalankan Bersama Seluruh Stack (Docker Compose - Direkomendasikan)
Dari direktori root proyek:
```bash
docker compose up --build
```
Akses frontend di: **[http://localhost:3000](http://localhost:3000)**

---

### Opsi 2: Menjalankan Mandiri di Lingkungan Lokal (Node.js)
Pastikan backend API sudah aktif di port `5000`.
```powershell
cd frontend

# 1. Install dependensi
npm install

# 2. Jalankan server development
npm run dev
```
Buka browser di: **[http://localhost:3000](http://localhost:3000)**

---

### Opsi 3: Kompilasi & Menjalankan Production Build
```powershell
cd frontend
npm run build
npm run start
```

---

## 📂 Struktur Direktori Frontend

```text
frontend/
├── Dockerfile                  # Multi-stage Dockerfile (deps -> builder -> runner standalone)
├── .dockerignore               # File yang diabaikan saat docker build
├── next.config.ts              # Konfigurasi Next.js (output standalone & API rewrites)
├── package.json                # Dependensi frontend (Next 16, React 19, Tailwind v4, Lucide)
├── tsconfig.json               # Konfigurasi TypeScript
├── public/                     # Aset statis & ikon
└── src/
    ├── app/
    │   ├── admin/              # Portal Dashboard Admin & Mitra UMKM
    │   ├── login/              # Halaman Login
    │   ├── produk/[id]/        # Halaman Detail Produk Mandiri
    │   ├── page.tsx            # Landing Page Utama
    │   ├── layout.tsx          # Root Layout & Metadata
    │   └── globals.css         # Tailwind CSS & Keyframe Animations
    ├── components/
    │   ├── Navbar.tsx          # Navigasi atas, search trigger, drawer triggers
    │   ├── HeroSection.tsx     # Hero banner interaktif & statistik
    │   ├── CategorySection.tsx # Kategori dinamis dengan count riil dari database
    │   ├── ProductCatalog.tsx  # Katalog produk, multi-filter, search, dan pagination
    │   ├── ProductCard.tsx     # Kartu tampilan produk & badge stok/diskon
    │   ├── ProductDetailModal.tsx # Modal pratinjau cepat produk
    │   ├── CartDrawer.tsx      # Keranjang belanja multi-item & kalkulasi berat
    │   ├── WishlistDrawer.tsx  # Drawer produk favorit
    │   ├── PartnerRegisterModal.tsx # Form pendaftaran mitra UMKM baru
    │   ├── UmkmStorySection.tsx# Cerita pengrajin dapur tradisional & nilai keunggulan
    │   └── Footer.tsx          # Footer navigasi & informasi kontak
    ├── context/
    │   └── CartContext.tsx     # State manajemen global (100% terhubung ke REST API)
    ├── lib/
    │   ├── api.ts              # Service client pemanggil REST API backend
    │   ├── formatters.ts       # Format mata uang Rupiah & format angka
    │   └── whatsapp.ts         # Generator tautan WhatsApp pemesanan terformat
    ├── types/
    │   └── product.ts          # Definisi antarmuka TypeScript (Product, Order, Partner, dll.)
    └── data/
        └── dummyData.ts        # File dummy dikosongkan (Zero Dummy Data)
```
