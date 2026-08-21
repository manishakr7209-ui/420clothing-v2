import { Router } from 'express'
import prisma from '../utils/prisma'
import { protect, adminOnly, developerOnly } from '../middleware/auth.middleware'

const router = Router()

// Dashboard stats
router.get('/dashboard', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueData, lowStock] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.inventory.count({ where: { quantity: { lte: 5 } } }),
    ])

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenueData._sum.totalAmount || 0,
        lowStockAlerts: lowStock,
      }
    })
  } catch (error) { next(error) }
})

// Action logs (Dev only)
router.get('/logs', protect, developerOnly, async (req, res, next) => {
  try {
    const logs = await prisma.actionLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    res.json({ success: true, data: logs })
  } catch (error) { next(error) }
})

// Sales chart data
router.get('/analytics', protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      select: { totalAmount: true, createdAt: true, paymentMethod: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
    res.json({ success: true, data: orders })
  } catch (error) { next(error) }
})

// All customers
router.get('/customers', protect, adminOnly, async (req, res, next) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: customers })
  } catch (error) { next(error) }
})

export default router
