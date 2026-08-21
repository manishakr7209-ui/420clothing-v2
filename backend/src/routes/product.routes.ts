import { Router } from 'express'
import { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, toggleLock } from '../controllers/product.controller'
import { protect, adminOnly, developerOnly } from '../middleware/auth.middleware'

const router = Router()

// Public routes
router.get('/',          getAllProducts)
router.get('/:slug',     getProductBySlug)

// Admin + Dev routes
router.post('/',         protect, adminOnly,     createProduct)
router.put('/:id',       protect, developerOnly, updateProduct)
router.delete('/:id',    protect, developerOnly, deleteProduct)
router.patch('/:id/lock',protect, developerOnly, toggleLock)

export default router
