import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { createError } from '../middleware/error.middleware'

// ===== GET ALL PRODUCTS =====
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, minPrice, maxPrice, size, search, page = 1, limit = 12 } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    const where: any = { isActive: true }

    if (category) where.category = { slug: category }
    if (search) where.name = { contains: String(search), mode: 'insensitive' }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          inventory: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

// ===== GET SINGLE PRODUCT =====
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
      },
    })

    if (!product) return next(createError('Product not found', 404))

    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

// ===== CREATE PRODUCT (Admin/Dev only) =====
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug, description, price, originalPrice, categoryId, isNew, images } = req.body

    if (!name || !slug || !price || !categoryId) {
      return next(createError('Name, slug, price and category are required', 400))
    }

    const product = await prisma.product.create({
      data: { name, slug, description, price: Number(price), originalPrice: originalPrice ? Number(originalPrice) : null, categoryId, isNew: isNew || false, images: images || [] },
      include: { category: true },
    })

    // Log action
    await prisma.actionLog.create({
      data: {
        role: req.user.role,
        action: 'CREATE_PRODUCT',
        details: `Created product: ${name} (ID: ${product.id})`,
      }
    })

    res.status(201).json({ success: true, message: 'Product created', data: product })
  } catch (error) {
    next(error)
  }
}

// ===== UPDATE PRODUCT (Dev only) =====
export const updateProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return next(createError('Product not found', 404))
    if (existing.isLocked) return next(createError('Product is locked — cannot edit', 403))

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    })

    await prisma.actionLog.create({
      data: {
        role: req.user.role,
        action: 'UPDATE_PRODUCT',
        details: `Updated product: ${product.name} (ID: ${id})`,
      }
    })

    res.json({ success: true, message: 'Product updated', data: product })
  } catch (error) {
    next(error)
  }
}

// ===== DELETE PRODUCT (Dev only) =====
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return next(createError('Product not found', 404))
    if (existing.isLocked) return next(createError('Product is locked — cannot delete', 403))

    await prisma.product.update({ where: { id }, data: { isActive: false } })

    await prisma.actionLog.create({
      data: {
        role: req.user.role,
        action: 'DELETE_PRODUCT',
        details: `Deleted product: ${existing.name} (ID: ${id})`,
      }
    })

    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
}

// ===== LOCK/UNLOCK PRODUCT (Dev only) =====
export const toggleLock = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return next(createError('Product not found', 404))

    const product = await prisma.product.update({
      where: { id },
      data: { isLocked: !existing.isLocked },
    })

    await prisma.actionLog.create({
      data: {
        role: req.user.role,
        action: product.isLocked ? 'LOCK_PRODUCT' : 'UNLOCK_PRODUCT',
        details: `${product.isLocked ? 'Locked' : 'Unlocked'} product: ${product.name}`,
      }
    })

    res.json({
      success: true,
      message: `Product ${product.isLocked ? 'locked' : 'unlocked'}`,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}
