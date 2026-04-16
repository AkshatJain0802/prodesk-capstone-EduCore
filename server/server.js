import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import './config/cloudinary.js'

import courseRoutes   from './routes/courseRoutes.js'
import userRoutes     from './routes/userRoutes.js'
import purchaseRoutes from './routes/purchaseRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import { clerkWebhookHandler } from './webhooks/clerkWebhook.js'
import { stripeWebhookHandler } from './webhooks/stripeWebhook.js'

const app = express()

// Stripe webhook needs raw body — must come BEFORE express.json()
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler)

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

// Webhooks
app.post('/webhooks/clerk', clerkWebhookHandler)

// API Routes
app.use('/api/courses',   courseRoutes)
app.use('/api/user',      userRoutes)
app.use('/api/purchase',  purchaseRoutes)
app.use('/api/progress',  progressRoutes)

// Health check
app.get('/', (req, res) => res.json({ message: '✅ EduCore API running' }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 4000}`)
  })
})
