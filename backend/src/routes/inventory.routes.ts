import { Router } from 'express'
import prisma from '../utils/prisma'
import { protect, adminOnly } from '../middleware/auth.middleware'

const router = Router()

// Get inventory for a product
router.get('/:productId', async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: { productId: req.params.productId }
    })
    res.json({ success: true, data: inventory })
  } catch (error) { next(error) }
})

// Update inventory (Admin/Dev)
router.put('/:productId', protect, adminOnly, async (req: any, res, next) => {
  try {
    const { size, colour, quantity } = req.body
    const inv = await prisma.inventory.upsert({
      where: { productId_size_colour: { productId: req.params.productId, size, colour } },
      update: { quantity },
      create: { productId: req.params.productId, size, colour, quantity }
    })
    await prisma.actionLog.create({
      data: { role: req.user.role, action: 'UPDATE_INVENTORY', details: `Updated stock: ${req.params.productId} ${size} ${colour} → ${quantity}` }
    })
    res.json({ success: true, data: inv })
  } catch (error) { next(error) }
})

// Get low stock items
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const lowStock = await prisma.inventory.findMany({
      where: { quantity: { lte: 5 } },
      include: { product: { select: { name: true } } }
    })
    res.json({ success: true, data: lowStock })
  } catch (error) { next(error) }
})

export default router
