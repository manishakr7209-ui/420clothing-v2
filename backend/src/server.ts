import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'
import inventoryRoutes from './routes/inventory.routes'
import categoryRoutes from './routes/category.routes'
import adminRoutes from './routes/admin.routes'

// Import middleware
import { errorHandler } from './middleware/error.middleware'
import { notFound } from './middleware/notFound.middleware'

const app = express()
const PORT = process.env.PORT || 5000

// ===== MIDDLEWARE =====
app.use(helmet())                          // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))                     // Request logger
app.use(express.json())                    // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '420 CLOTHING API is running 🔥',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    uptime: process.uptime(),
  })
})

// ===== API ROUTES =====
app.use('/api/v1/auth',      authRoutes)
app.use('/api/v1/products',  productRoutes)
app.use('/api/v1/orders',    orderRoutes)
app.use('/api/v1/inventory', inventoryRoutes)
app.use('/api/v1/categories',categoryRoutes)
app.use('/api/v1/admin',     adminRoutes)

// ===== ERROR HANDLING =====
app.use(notFound)
app.use(errorHandler)

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
  🔥 420 CLOTHING SERVER RUNNING
  ──────────────────────────────
  Local:   http://localhost:${PORT}
  Health:  http://localhost:${PORT}/api/health
  API:     http://localhost:${PORT}/api/v1
  `)
})

export default app
