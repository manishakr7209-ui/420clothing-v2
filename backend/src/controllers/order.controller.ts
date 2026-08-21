import { Request, Response, NextFunction } from 'express'
import prisma from '../utils/prisma'
import { createError } from '../middleware/error.middleware'

// ===== CREATE ORDER =====
export const createOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, paymentMethod, address, city, pincode, phone } = req.body

    if (!items || items.length === 0) {
      return next(createError('Order must have at least one item', 400))
    }

    // Calculate total
    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return next(createError(`Product ${item.productId} not found`, 404))
      totalAmount += product.price * item.quantity

      // Check and reduce inventory
      const inv = await prisma.inventory.findUnique({
        where: { productId_size_colour: { productId: item.productId, size: item.size, colour: item.colour } }
      })
      if (!inv || inv.quantity < item.quantity) {
        return next(createError(`Not enough stock for ${product.name} - ${item.size}`, 400))
      }

      await prisma.inventory.update({
        where: { productId_size_colour: { productId: item.productId, size: item.size, colour: item.colour } },
        data: { quantity: { decrement: item.quantity } }
      })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        paymentMethod,
        address,
        city,
        pincode,
        phone,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size,
            colour: item.colour,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: { items: true }
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully 🎉',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// ===== GET MY ORDERS =====
export const getMyOrders = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

// ===== GET ALL ORDERS (Admin) =====
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

// ===== UPDATE ORDER STATUS (Admin) =====
export const updateOrderStatus = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { orderStatus, paymentStatus } = req.body

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      }
    })

    await prisma.actionLog.create({
      data: {
        role: req.user.role,
        action: 'UPDATE_ORDER',
        details: `Updated order #${id} — status: ${orderStatus || paymentStatus}`,
      }
    })

    res.json({ success: true, message: 'Order updated', data: order })
  } catch (error) {
    next(error)
  }
}
