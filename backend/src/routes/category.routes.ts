import { Router } from 'express'
import prisma from '../utils/prisma'
import { protect, adminOnly } from '../middleware/auth.middleware'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    })
    res.json({ success: true, data: categories })
  } catch (error) { next(error) }
})

router.post('/', protect, adminOnly, async (req: any, res, next) => {
  try {
    const { name, slug, description } = req.body
    const category = await prisma.category.create({ data: { name, slug, description } })
    await prisma.actionLog.create({
      data: { role: req.user.role, action: 'CREATE_CATEGORY', details: `Created category: ${name}` }
    })
    res.status(201).json({ success: true, data: category })
  } catch (error) { next(error) }
})

export default router
