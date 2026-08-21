import { Router } from 'express'
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller'
import { protect, adminOnly } from '../middleware/auth.middleware'

const router = Router()

router.post('/',          protect,            createOrder)
router.get('/my-orders',  protect,            getMyOrders)
router.get('/',           protect, adminOnly, getAllOrders)
router.patch('/:id',      protect, adminOnly, updateOrderStatus)

export default router
