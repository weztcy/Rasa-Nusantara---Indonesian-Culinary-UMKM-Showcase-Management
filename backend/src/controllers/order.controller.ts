import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { OrderStatus } from '@prisma/client';

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { customerName, customerPhone, customerAddress, customerNotes, items } = req.body;

    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length === 0) {
      res.status(400).json({ success: false, message: 'Produk yang dipesan tidak valid' });
      return;
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedTotal = 0;
    let calculatedWeight = 0;
    const orderItemsData = [];

    for (const item of items) {
      const prod = productMap.get(item.productId);
      if (!prod) continue;

      const subtotal = prod.price * item.quantity;
      calculatedTotal += subtotal;
      calculatedWeight += (prod.weightGram || 200) * item.quantity;

      orderItemsData.push({
        productId: prod.id,
        quantity: item.quantity,
        priceAtPurchase: prod.price,
        note: item.note || null,
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `RN-${todayStr}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        customerNotes: customerNotes || null,
        totalPrice: calculatedTotal,
        totalWeightGram: calculatedWeight,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: { producer: true },
            },
          },
        },
      },
    });

    // Increment sold counts
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity } },
      }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search } = req.query as any;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unit: true,
                image: true,
                price: true,
                producer: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: {
              include: { producer: true },
            },
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status, shippingCourier, trackingNumber } = req.body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        shippingCourier: shippingCourier !== undefined ? shippingCourier : existing.shippingCourier,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : existing.trackingNumber,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Status pesanan berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
      return;
    }

    await prisma.order.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Pesanan berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
}
