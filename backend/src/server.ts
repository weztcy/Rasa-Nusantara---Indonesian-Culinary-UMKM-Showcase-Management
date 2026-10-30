import { createApp } from './app';
import { ENV } from './config/env';
import prisma from './config/prisma';

const app = createApp();

const server = app.listen(ENV.PORT, async () => {
  console.log(`🚀 [Backend Server] Berjalan pada http://localhost:${ENV.PORT}`);
  console.log(`🔒 [Security] Helmet, CORS, dan Rate Limiting aktif`);
  console.log(`📦 [Database] Menghubungkan ke MySQL via Prisma (${ENV.DATABASE_URL.replace(/:[^:@]+@/, ':****@')})...`);

  try {
    await prisma.$connect();
    console.log(`✅ [Database] Koneksi MySQL terhubung dengan sukses!`);
  } catch (error: any) {
    console.warn(`⚠️ [Database Warning] Belum dapat terhubung ke MySQL: ${error.message}`);
    console.warn(`ℹ️ Pastikan server MySQL lokal aktif dan database "rasanusantara_db" sudah dibuat.`);
  }
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Menerima sinyal ${signal}, menutup server dengan aman...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log(`👋 Server dan koneksi database ditutup. Sampai jumpa!`);
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
