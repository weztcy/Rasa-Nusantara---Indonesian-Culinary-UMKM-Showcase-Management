import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export async function getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 'default',
          storeName: 'RasaNusantara UMKM',
          tagline: 'Etalase Kuliner Otentik & Pemberdayaan Usaha Mikro Indonesia',
          primaryPhone: '6281234567801',
          email: 'halo@rasanusantara.id',
          address: 'Jl. Malioboro No. 45, D.I. Yogyakarta & Smesco Indonesia Jakarta',
          bankAccount: '137-00-1928371-2',
          bankName: 'Bank Mandiri',
          bankHolder: 'Koperasi Mitra UMKM Nusantara',
          announcement: 'Gratis ongkir untuk pengiriman sesama pulau Jawa dengan minimal order Rp 150.000!',
        },
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;

    const settings = await prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        storeName: data.storeName || 'RasaNusantara UMKM',
        tagline: data.tagline || 'Etalase Kuliner Otentik',
        primaryPhone: data.primaryPhone || '6281234567801',
        email: data.email || 'halo@rasanusantara.id',
        address: data.address || 'Yogyakarta, Indonesia',
        bankAccount: data.bankAccount || '137-00-1928371-2',
        bankName: data.bankName || 'Bank Mandiri',
        bankHolder: data.bankHolder || 'Koperasi Mitra UMKM Nusantara',
        announcement: data.announcement || '',
      },
    });

    res.json({
      success: true,
      message: 'Pengaturan toko berhasil diperbarui',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}
