import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createCheckoutSession } from '../controllers/purchaseController.js'

const router = express.Router()

router.post('/', protect, createCheckoutSession)

export default router
