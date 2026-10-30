import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      description: c.description,
      count: c._count.products,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}
