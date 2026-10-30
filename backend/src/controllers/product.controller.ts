import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

function parseJsonField(val: string | null | undefined, defaultVal: any = []) {
  if (!val) return defaultVal;
  try {
    return JSON.parse(val);
  } catch {
    return val.split(',').map((s) => s.trim());
  }
}

function formatProduct(p: any) {
  const categoryId = p.categoryId || (typeof p.category === 'string' ? p.category : p.category?.id) || 'snack';
  const categoryLabel = p.category?.name || 'Kuliner Nusantara';
  const categoryIcon = p.category?.icon || 'Utensils';

  return {
    ...p,
    category: categoryId,
    categoryLabel: categoryLabel,
    categoryIcon: categoryIcon,
    categoryObj: p.category,
    gallery: parseJsonField(p.gallery, [p.image]),
    ingredients: parseJsonField(p.ingredients, []),
    certifications: parseJsonField(p.certifications, []),
    tags: parseJsonField(p.tags, []),
  };
}

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search, sortBy, bestSeller, discountOnly, page = '1', limit = '50' } = req.query as any;

    const where: any = {};

    if (category && category !== 'all') {
      where.categoryId = category;
    }

    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }

    if (discountOnly === 'true') {
      where.originalPrice = { not: null, gt: prisma.product.fields.price };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { producer: { name: { contains: q } } },
        { producer: { city: { contains: q } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { soldCount: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          producer: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products.map(formatProduct),
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        producer: true,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
      return;
    }

    res.json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      name,
      categoryId,
      price,
      originalPrice,
      unit,
      weightGram,
      image,
      gallery,
      description,
      ingredients,
      shelfLife,
      spicyLevel,
      certifications,
      producerId,
      producer: producerData,
      isBestSeller,
      stockStatus,
      tags,
    } = req.body;

    let targetProducerId = producerId;

    // If producer details are supplied directly, find or create producer
    if (!targetProducerId && producerData) {
      const createdProducer = await prisma.producer.create({
        data: {
          name: producerData.name,
          owner: producerData.owner,
          city: producerData.city,
          province: producerData.province,
          waNumber: producerData.waNumber,
          story: producerData.story || 'Produsen kuliner lokal terpercaya',
          avatar: producerData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          establishedYear: producerData.establishedYear || 2020,
        },
      });
      targetProducerId = createdProducer.id;
    }

    // Default producer fallback if none provided
    if (!targetProducerId) {
      const defaultProducer = await prisma.producer.findFirst();
      if (defaultProducer) {
        targetProducerId = defaultProducer.id;
      } else {
        const created = await prisma.producer.create({
          data: {
            name: 'Dapur UMKM Nusantara',
            owner: 'Mitra Pengrajin',
            city: 'Yogyakarta',
            province: 'D.I. Yogyakarta',
            waNumber: '6281234567801',
            story: 'Dapur kuliner lokal tradisional',
            establishedYear: 2020,
          },
        });
        targetProducerId = created.id;
      }
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        price,
        originalPrice: originalPrice || null,
        unit,
        weightGram: weightGram || 200,
        image,
        gallery: JSON.stringify(gallery || [image]),
        description,
        ingredients: JSON.stringify(ingredients || []),
        shelfLife,
        spicyLevel: spicyLevel || 0,
        certifications: JSON.stringify(certifications || []),
        producerId: targetProducerId,
        isBestSeller: Boolean(isBestSeller),
        isNew: true,
        stockStatus: stockStatus || 'ready',
        tags: JSON.stringify(tags || []),
      },
      include: {
        category: true,
        producer: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan ke katalog',
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const body = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
      return;
    }

    const updateData: any = { ...body };
    if (body.gallery) updateData.gallery = JSON.stringify(body.gallery);
    if (body.ingredients) updateData.ingredients = JSON.stringify(body.ingredients);
    if (body.certifications) updateData.certifications = JSON.stringify(body.certifications);
    if (body.tags) updateData.tags = JSON.stringify(body.tags);

    // Remove nested object if not relation
    delete updateData.producer;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        producer: true,
      },
    });

    res.json({
      success: true,
      message: 'Data produk berhasil diperbarui',
      data: formatProduct(updated),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Produk berhasil dihapus dari katalog',
    });
  } catch (error) {
    next(error);
  }
}
