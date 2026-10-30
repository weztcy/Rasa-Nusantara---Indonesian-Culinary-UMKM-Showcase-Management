import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { PartnerStatus, Role } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function normalizeCategoryId(rawCat: string): string {
  const lower = (rawCat || '').toLowerCase();
  if (lower.includes('sambal') || lower.includes('bumbu')) return 'sambal';
  if (lower.includes('lauk') || lower.includes('daging') || lower.includes('ikan')) return 'lauk';
  if (lower.includes('kue') || lower.includes('pastry') || lower.includes('roti')) return 'kue';
  if (lower.includes('frozen') || lower.includes('beku')) return 'frozen';
  if (lower.includes('minum') || lower.includes('kopi') || lower.includes('herbal')) return 'minuman';
  return 'snack';
}

const CATEGORY_IMAGES: Record<string, string> = {
  snack: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  sambal: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  lauk: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  kue: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  frozen: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  minuman: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
};

export async function submitPartner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { brandName, ownerName, city, waNumber, category, certification, description } = req.body;

    const submission = await prisma.partnerSubmission.create({
      data: {
        brandName,
        ownerName,
        city,
        waNumber,
        category,
        certification,
        description,
        status: PartnerStatus.PENDING,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pendaftaran kemitraan berhasil dikirim. Tim kami akan segera meninjau.',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPartners(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.query as any;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const submissions = await prisma.partnerSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePartnerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const existing = await prisma.partnerSubmission.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Data pengajuan tidak ditemukan' });
      return;
    }

    const newStatus = status as PartnerStatus;
    const updated = await prisma.partnerSubmission.update({
      where: { id },
      data: { status: newStatus },
    });

    let createdProduct = null;
    let createdProducer = null;
    let createdUser = null;

    // JIKA DISETUJUI (APPROVED):
    // 1. Buat record Producer di MySQL jika belum ada
    // 2. Buat akun User mitra jika belum ada
    // 3. Otomatis buatkan 1 produk perdana mitra agar LANGSUNG TAMPIL DI KATALOG ETALASE
    if (newStatus === PartnerStatus.APPROVED) {
      // 1. Cari atau buat Producer
      createdProducer = await prisma.producer.findFirst({
        where: { name: existing.brandName },
      });

      if (!createdProducer) {
        createdProducer = await prisma.producer.create({
          data: {
            name: existing.brandName,
            owner: existing.ownerName,
            city: existing.city,
            province: 'Indonesia',
            waNumber: existing.waNumber,
            story: existing.description || `Produsen kuliner nusantara terkurasi dari ${existing.city}.`,
            establishedYear: new Date().getFullYear(),
          },
        });
      }

      // 2. Cari atau buat Akun User Mitra
      const cleanBrand = slugify(existing.brandName).replace(/-/g, '');
      const partnerEmail = `mitra.${cleanBrand}@rasanusantara.id`;
      createdUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: partnerEmail }, { brandName: existing.brandName }],
        },
      });

      if (!createdUser) {
        const defaultPasswordHash = await bcrypt.hash('mitra123', 10);
        createdUser = await prisma.user.create({
          data: {
            name: existing.ownerName,
            email: partnerEmail,
            password: defaultPasswordHash,
            role: Role.PARTNER,
            phone: existing.waNumber,
            brandName: existing.brandName,
          },
        });

        // Hubungkan producer ke user
        await prisma.producer.update({
          where: { id: createdProducer.id },
          data: { userId: createdUser.id },
        });
      }

      // 3. Buat Produk Perdana di Katalog Etalase (jika belum ada produk dari produsen ini)
      const existingProduct = await prisma.product.findFirst({
        where: { producerId: createdProducer.id },
      });

      if (!existingProduct) {
        const catId = normalizeCategoryId(existing.category);
        const baseSlug = slugify(`${existing.brandName}-spesial`);
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const fallbackImg = CATEGORY_IMAGES[catId] || CATEGORY_IMAGES.snack;

        createdProduct = await prisma.product.create({
          data: {
            name: `${existing.brandName} - Produk Unggulan Khas ${existing.city}`,
            slug: uniqueSlug,
            categoryId: catId,
            price: 35000,
            originalPrice: 42000,
            unit: 'Kemasan Pouch 250g',
            weightGram: 250,
            rating: 5.0,
            reviewCount: 1,
            soldCount: 0,
            image: fallbackImg,
            description: existing.description || `Produk kuliner otentik persembahan ${existing.brandName} dari ${existing.city}. Dibuat secara higienis menggunakan bahan-bahan lokal pilihan berkualitas tinggi.`,
            ingredients: 'Bahan alami lokal berkualitas, rempah nusantara pilihan, tanpa pengawet buatan',
            shelfLife: '3 Bulan (Suhu Ruang)',
            spicyLevel: catId === 'sambal' ? 3 : 0,
            certifications: existing.certification || 'P-IRT & Halal Terverifikasi',
            producerId: createdProducer.id,
            isNew: true,
            isBestSeller: false,
            stockStatus: 'ready',
          },
          include: {
            producer: true,
            category: true,
          },
        });
      }
    }

    res.json({
      success: true,
      message: newStatus === PartnerStatus.APPROVED
        ? `Pendaftaran mitra ${existing.brandName} berhasil disetujui! Profil produsen, akun login, dan produk perdana otomatis ditambahkan ke katalog etalase.`
        : `Pendaftaran mitra ${existing.brandName} telah ditolak.`,
      data: {
        submission: updated,
        producer: createdProducer,
        product: createdProduct,
        user: createdUser ? { email: createdUser.email, role: createdUser.role } : null,
      },
    });
  } catch (error) {
    next(error);
  }
}
