# ⚙️ Backend RasaNusantara REST API - MySQL & Prisma ORM

[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)

Layanan REST API backend untuk platform **RasaNusantara**, sebuah sistem showcase dan manajemen kuliner otentik UMKM nusantara. Dibangun menggunakan **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, dan **MySQL Database**, serta dilengkapi arsitektur keamanan tingkat produksi (*Production-Ready Security*) dan validasi data yang ketat.

> ⚡ **Zero Dummy Data**: Seluruh data produk, kategori, pesanan, dan mitra disimpan secara terstruktur dan persisten di database relasional MySQL.

---

## 📌 Daftar Isi
1. [Tentang Backend (Ini Project Apa?)](#-tentang-backend-ini-project-apa)
2. [Arsitektur Keamanan (Security) & Validasi](#-arsitektur-keamanan-security--validasi)
3. [Fitur-Fitur & Modul Backend](#-fitur-fitur--modul-backend)
4. [Skema Database & Model Relasional](#-skema-database--model-relasional)
5. [Database Seeder Lengkap](#-database-seeder-lengkap)
6. [Kredensial Login Seeder](#-kredensial-login-seeder)
7. [Alur Kerja Sistem (Workflows)](#-alur-kerja-sistem-workflows)
8. [Dokumentasi Lengkap Endpoint REST API](#-dokumentasi-lengkap-endpoint-rest-api)
9. [Variabel Lingkungan (Environment Variables)](#-variabel-lingkungan-environment-variables)
10. [Cara Menjalankan Backend](#-cara-menjalankan-backend)
11. [Struktur Direktori Backend](#-struktur-direktori-backend)

---

## 💡 Tentang Backend (Ini Project Apa?)

Backend RasaNusantara bertanggung jawab sebagai mesin pusat pemrosesan bisnis yang:
1. Menyediakan data katalog makanan nusantara dengan performa kueri cepat dan akurat.
2. Mengelola proses autentikasi pengguna dengan otorisasi berbasis peran (*Role-Based Access Control / RBAC*).
3. Mencatat dan mengelola riwayat pesanan pelanggan dari hasil checkout keranjang belanja WhatsApp.
4. Menampung dan memproses alur verifikasi kemitraan UMKM baru (Terima / Tolak pendaftaran).
5. Mengotomatisasi migrasi database dan pengisian seeder awal saat aplikasi pertama kali dijalankan.

---

## 🛡️ Arsitektur Keamanan (Security) & Validasi

Backend dirancang dengan prinsip *defense-in-depth* untuk melindungi data bisnis dan integritas sistem:

1. **Helmet HTTP Security Headers**:
   - Menghalangi serangan *clickjacking* (`X-Frame-Options: SAMEORIGIN`).
   - Mencegah *MIME sniffing* (`X-Content-Type-Options: nosniff`).
   - Menegakkan HTTPS transport security (`Strict-Transport-Security`).
2. **CORS (Cross-Origin Resource Sharing)**:
   - Dibatasi secara ketat pada origin frontend resmi (`http://localhost:3000`) dengan dukungan pengiriman kredensial otentikasi.
3. **Express Rate Limiting**:
   - **General API Limiter**: Membatasi laju request per IP untuk mencegah *scraping*, spamming, dan serangan *Denial of Service (DoS)*.
   - **Auth Limiter**: Membatasi percobaan login untuk mencegah serangan *brute force* password.
4. **Enkripsi Kata Sandi (Bcrypt)**:
   - Seluruh kata sandi pengguna di-hash menggunakan algoritma `bcryptjs` dengan *salt rounds* 10 sebelum disimpan ke database MySQL. Kata sandi mentah tidak pernah tersimpan di sistem.
5. **Autentikasi Token JWT & Otorisasi RBAC**:
   - Sesi pengguna diverifikasi melalui *JSON Web Token* (Bearer token) dengan masa kedaluwarsa 7 hari.
   - Akses rute dibatasi berdasarkan peran:
     - `PUBLIC`: Mengakses katalog produk, kategori, membuat order, submit pendaftaran mitra.
     - `PARTNER`: Menambah/mengedit produk dan melihat pesanan milik tokonya sendiri.
     - `ADMIN`: Akses penuh terhadap seluruh katalog nasional, semua pesanan, verifikasi pendaftaran mitra, dan pengaturan profil toko.
6. **Validasi & Sanitasi Input (Zod)**:
   - Semua *request body* dan *query parameters* divalidasi oleh skema Zod sebelum masuk ke controller. Request yang tidak valid otomatis ditolak dengan kode `400 Bad Request` dan rincian field error yang jelas.
7. **Pencegahan SQL Injection**:
   - Seluruh interaksi database dieksekusi melalui **Prisma ORM** yang secara otomatis menggunakan kueri berparameter (*prepared statements*).

---

## ⚙️ Fitur-Fitur & Modul Backend

1. **Modul Autentikasi (`/api/auth`)**:
   - Login dengan verifikasi password hash bcrypt dan penerbitan token JWT.
   - Endpoint verifikasi token aktif (`/api/auth/me`).
2. **Modul Kategori Produk (`/api/categories`)**:
   - Mengelola 6 kategori kuliner nusantara (*Keripik & Cemilan, Sambal & Bumbu, Lauk & Makanan Khas, Kue & Pastry, Frozen Food, Minuman Tradisional*).
   - Menghitung jumlah produk aktif per kategori secara dinamis.
3. **Modul Produk Makanan (`/api/products`)**:
   - Operasi CRUD penuh (*Create, Read, Update, Delete*).
   - Fitur pencarian teks bebas (nama produk, deskripsi, kota produsen).
   - Filter berdasarkan ID kategori, filter *Best Seller*, dan pengurutan (*sorting*).
   - Serialisasi data (`formatProduct`) yang mengembalikan string ID kategori yang konsisten, label kategori, serta ikon emoji untuk kemudahan rendering frontend.
4. **Modul Pesanan Pelanggan (`/api/orders`)**:
   - Pembuatan transaksi pesanan baru dari checkout keranjang belanja.
   - Penomoran resi internal unik berformat `RN-YYYYMMDD-XXX`.
   - Update status pesanan (*PENDING, PROCESSING, SHIPPED, COMPLETED, CANCELLED*).
   - Penyimpanan informasi kurir ekspedisi (JNE, Paxel, SiCepat) dan nomor resi pengiriman.
5. **Modul Pendaftaran Kemitraan UMKM (`/api/partners`)**:
   - Menampung data pengajuan kemitraan baru dari website (brand, nama pemilik, nomor WA, sertifikasi, kota).
   - **Khusus Super Admin**: Mengubah status pengajuan (*APPROVED / REJECTED*).
6. **Modul Pengaturan Toko (`/api/settings`)**:
   - Mengelola identitas toko pusat, kontak WhatsApp koordinator, rekening bank koperasi, dan banner pengumuman promo.

---

## 🗄️ Skema Database & Model Relasional

Didefinisikan dalam [`prisma/schema.prisma`](file:///c:/Users/yohan/Documents/antigravity/charming-shannon/backend/prisma/schema.prisma):

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│     User     │ 1      1 │   Producer   │ 1      * │   Product    │
│ (Admin/Mitra)├──────────┤ (Profil UMKM)├──────────┤ (Menu Makanan)│
└──────────────┘          └──────────────┘          └──────┬───────┘
                                                           │
                                             *           1 │
┌──────────────┐          ┌──────────────┐          ┌──────┴───────┐
│    Order     │ 1      * │  OrderItem   │ *      1 │   Category   │
│ (Transaksi)  ├──────────┤ (Item Pesanan)├──────────┤  (Kategori)  │
└──────────────┘          └──────────────┘          └──────────────┘

┌────────────────────────┐                  ┌────────────────────────┐
│   PartnerSubmission    │                  │      StoreSetting      │
│ (Pendaftaran Kemitraan)│                  │(Profil & Kontak Pusat) │
└────────────────────────┘                  └────────────────────────┘
```

---

## 🌱 Database Seeder Lengkap

Script seeder ([`prisma/seed.ts`](file:///c:/Users/yohan/Documents/antigravity/charming-shannon/backend/prisma/seed.ts)) mengisi database dengan data awal yang kaya dan representatif:
- **37 Produk Kuliner Otentik**: Keripik Tempe Sanan Malang, Sambal Roa Mama Nonce Manado, Rendang Suwir Uni Nel Bukittinggi, Pempek Tenggiri Cek Mey Palembang, Dodol Garut, Bakpia Pathok Jogja, Lapis Legit Semarang, Bumbu Rawon Surabaya, Jamu Kunyit Asam Solo, Abon Cakalang Maluku, dll.
- **16 Profil Produsen Terkurasi**: Lengkap dengan nama pemilik, kota asal, dan nomor WhatsApp.
- **8 Pesanan Pelanggan**: Mencakup berbagai status (*Pending, Processing, Shipped, Completed*).
- **8 Pendaftaran Kemitraan UMKM**: Mencakup status *Pending*, *Approved*, dan *Rejected*.
- **4 Akun Pengguna Terdaftar**: 1 Super Admin dan 3 Mitra UMKM.

---

## 🔐 Kredensial Login Seeder

| Peran (Role) | Brand / Asal UMKM | Email Login | Password | Hak Akses & Wewenang |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Pusat RasaNusantara | `admin@rasanusantara.id` | `admin123` | **Full Access**: Kelola seluruh produk se-Indonesia, pantau semua pesanan, verifikasi mitra (Terima/Tolak), dan pengaturan toko |
| **Mitra UMKM** | Dapur Bu Harti (Malang) | `buharti@malang.id` | `mitra123` | **Akses Mitra**: Khusus mengelola produk dan pesanan Dapur Bu Harti |
| **Mitra UMKM** | Rendang Uni Nel (Bukittinggi) | `uninel@bukittinggi.id` | `mitra123` | **Akses Mitra**: Khusus mengelola produk dan pesanan Rendang Uni Nel |
| **Mitra UMKM** | Pempek Cek Mey (Palembang) | `cekmey@palembang.id` | `mitra123` | **Akses Mitra**: Khusus mengelola produk dan pesanan Pempek Cek Mey |

---

## 🔄 Alur Kerja Sistem (Workflows)

### 1. Alur Transaksi Pesanan & Resi
1. Pelanggan melakukan checkout keranjang di frontend ➔ Frontend memanggil `POST /api/orders`.
2. Backend membuat record `Order` dan item `OrderItem` terkait dengan status `PENDING`.
3. Mitra UMKM atau Admin melihat order masuk di dashboard ➔ Mengubah status menjadi `PROCESSING`.
4. Setelah barang dikirim via kurir ekspedisi, Admin/Mitra memanggil `PUT /api/orders/:id/status` dengan menyertakan nama kurir dan nomor resi.
5. Pengguna dapat langsung menekan tombol WhatsApp notifikasi untuk mengirimkan rincian resi ke nomor pembeli.

### 2. Alur Pendaftaran Kemitraan UMKM (Terima vs Tolak)
1. Calon mitra mengisi formulir pendaftaran di website ➔ Memanggil `POST /api/partners`.
2. Pengajuan tersimpan di tabel `partner_submissions` dengan status `PENDING`.
3. **Khusus Super Admin** melihat pengajuan di tab *Verifikasi Mitra*:
   - **Tombol Terima (`APPROVED`)**: Menandakan profil produsen telah lolos kurasi cita rasa dan legalitas izin edar. Mitra siap dibuatkan akun produsen resmi dan produknya diterbitkan ke etalase utama.
   - **Tombol Tolak (`REJECTED`)**: Menolak pengajuan yang belum memenuhi persyaratan mutu (misal belum memiliki sertifikat P-IRT/Halal).

---

## 📡 Dokumentasi Lengkap Endpoint REST API

### 1. Kesehatan Layanan (Healthcheck)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Publik | Status uptime server dan kesiapan layanan |
| `GET` | `/` | Publik | Informasi umum API dan versi sistem |

### 2. Autentikasi (`/api/auth`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Login user (menerima email & password, mengembalikan token JWT) |
| `GET` | `/api/auth/me` | Authenticated | Mengambil profil user yang sedang aktif berdasarkan Bearer token |

### 3. Kategori Produk (`/api/categories`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Publik | Mengambil seluruh kategori kuliner dan jumlah count produk |
| `POST` | `/api/categories` | Super Admin | Menambahkan kategori makanan baru |

### 4. Katalog Produk (`/api/products`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Publik | Daftar produk (dukungan query: `category`, `search`, `sortBy`, `bestSeller`) |
| `GET` | `/api/products/:id` | Publik | Mengambil detail lengkap 1 produk makanan berdasarkan ID |
| `POST` | `/api/products` | Admin / Mitra | Menambahkan produk makanan baru ke database |
| `PUT` | `/api/products/:id` | Admin / Mitra Pemilik | Mengubah data produk makanan |
| `DELETE`| `/api/products/:id` | Admin / Mitra Pemilik | Menghapus produk makanan |

### 5. Pesanan Pelanggan (`/api/orders`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Admin / Mitra | Mengambil daftar pesanan pelanggan |
| `POST` | `/api/orders` | Publik | Membuat pesanan baru dari checkout keranjang |
| `PUT` | `/api/orders/:id/status`| Admin / Mitra | Memperbarui status pesanan, nama kurir, dan nomor resi |

### 6. Pendaftaran Kemitraan UMKM (`/api/partners`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/partners` | **Super Admin** | Mengambil seluruh antrean pengajuan pendaftaran mitra |
| `POST` | `/api/partners` | Publik | Mengirim formulir pendaftaran mitra baru dari website |
| `PUT` | `/api/partners/:id/status`| **Super Admin** | Mengubah status pengajuan (Terima: `APPROVED`, Tolak: `REJECTED`) |

### 7. Pengaturan Profil Toko (`/api/settings`)
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Publik | Mengambil informasi kontak dan profil toko pusat |
| `PUT` | `/api/settings` | **Super Admin** | Memperbarui profil toko, nomor WA koordinator, dan rekening bank |

---

## ⚙️ Variabel Lingkungan (Environment Variables)

File `.env` di folder `backend`:

| Nama Variabel | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port listen server Express API |
| `NODE_ENV` | `development` / `production` | Mode runtime lingkungan Node.js |
| `DATABASE_URL` | `mysql://root:@127.0.0.1:3306/rasanusantara_db` | URL koneksi ke database MySQL |
| `JWT_SECRET` | *(string rahasia)* | Kunci enkripsi token autentikasi JWT |
| `JWT_EXPIRES_IN` | `7d` | Masa berlaku sesi token login JWT |
| `CORS_ORIGIN` | `http://localhost:3000` | Alamat origin frontend yang diizinkan CORS |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Jendela waktu rate limit dalam milidetik (15 menit) |
| `RATE_LIMIT_MAX_REQUESTS`| `1000` | Batas maksimum request per jendela waktu |

---

## 🚀 Cara Menjalankan Backend

### Opsi 1: Menjalankan dengan Docker Compose (Rekomendasi)
Dari direktori root proyek:
```bash
docker compose up --build
```
Backend akan otomatis menunggu MySQL siap, menyinkronkan tabel Prisma, menjalankan seeder, dan aktif di port `5000`.

---

### Opsi 2: Menjalankan Lokal Menggunakan Laragon MySQL
1. Pastikan **Laragon** aktif dan database `rasanusantara_db` sudah dibuat.
2. Buka terminal di folder `backend`:
```powershell
cd backend

# 1. Install dependensi
npm install

# 2. Sinkronkan skema tabel ke MySQL
npx prisma db push

# 3. Jalankan script seeder lengkap
npx tsx prisma/seed.ts

# 4. Jalankan server backend (Hot Reload)
npm run dev
```
Healthcheck aktif di: **`http://localhost:5000/health`**

---

### Opsi 3: Kompilasi & Jalankan Mode Production
```powershell
cd backend
npm run build
npm start
```

---

## 📂 Struktur Direktori Backend

```text
backend/
├── Dockerfile                  # Multi-stage Dockerfile (builder TS -> runner Alpine ringan)
├── docker-entrypoint.sh        # Startup script auto-wait DB, prisma db push & auto-seed
├── .dockerignore               # File abaikan saat docker build
├── package.json                # Dependensi Express, Prisma, Zod, JWT, Bcrypt, Helmet
├── tsconfig.json               # Konfigurasi TypeScript compiler (ES2022 CommonJS)
├── prisma/
│   ├── schema.prisma           # Skema tabel database MySQL
│   └── seed.ts                 # Seeder 37 produk, 16 produsen, 8 pesanan, 8 mitra
└── src/
    ├── config/
    │   ├── db.ts               # Prisma Client singleton instance
    │   └── env.ts              # Validasi & parsing variabel lingkungan
    ├── controllers/
    │   ├── auth.controller.ts  # Logika login & profil user
    │   ├── category.controller.ts # Logika kategori produk & hitung count
    │   ├── product.controller.ts  # Logika CRUD produk makanan & filtering
    │   ├── order.controller.ts    # Logika pencatatan transaksi & resi kurir
    │   ├── partner.controller.ts  # Logika pendaftaran mitra & verifikasi Terima/Tolak
    │   └── setting.controller.ts  # Logika profil toko & nomor koordinator
    ├── middlewares/
    │   ├── auth.ts             # JWT Bearer token guard & otorisasi peran (RBAC)
    │   ├── security.ts         # Helmet headers, CORS policy, dan Express rate limiter
    │   ├── validate.ts         # Middleware eksekutor validasi Zod
    │   └── errorHandler.ts     # Penanganan error global & 404 handler
    ├── routes/
    │   ├── auth.routes.ts      # Rute /api/auth
    │   ├── category.routes.ts  # Rute /api/categories
    │   ├── product.routes.ts   # Rute /api/products
    │   ├── order.routes.ts     # Rute /api/orders
    │   ├── partner.routes.ts   # Rute /api/partners
    │   ├── setting.routes.ts   # Rute /api/settings
    │   └── index.ts            # Agregator router utama /api
    ├── validators/
    │   ├── auth.schema.ts      # Skema validasi login
    │   ├── product.schema.ts   # Skema validasi produk makanan
    │   ├── order.schema.ts     # Skema validasi order & status resi
    │   └── partner.schema.ts   # Skema validasi form pendaftaran mitra
    ├── app.ts                  # Inisialisasi Express Application Factory
    └── server.ts               # Entrypoint Server dengan Graceful Shutdown
```
