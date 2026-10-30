#!/bin/sh
set -e

echo "=================================================="
echo "🚀 Memulai Inisialisasi Backend RasaNusantara UMKM"
echo "=================================================="

# Tunggu koneksi database MySQL siap menerima query
echo "⏳ Menunggu database MySQL siap terhubung..."
MAX_TRIES=30
COUNT=0

until npx prisma db push --skip-generate > /dev/null 2>&1 || [ $COUNT -eq $MAX_TRIES ]; do
  COUNT=$((COUNT + 1))
  echo "⚠️ Database belum siap (Percobaan $COUNT/$MAX_TRIES), mencoba kembali dalam 3 detik..."
  sleep 3
done

if [ $COUNT -eq $MAX_TRIES ]; then
  echo "❌ Gagal terhubung ke database setelah $MAX_TRIES percobaan."
  exit 1
fi

echo "✅ Skema database Prisma berhasil disinkronkan ke MySQL!"

# Jalankan seeder database (37 produk, admin, mitra, order)
echo "🌱 Menjalankan Seeder data awal..."
npx tsx prisma/seed.ts || echo "⚠️ Seeding selesai atau dilewati."

echo "=================================================="
echo "🎉 Inisialisasi selesai. Menjalankan Server Backend..."
echo "=================================================="

exec "$@"
