import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getProgress, updateProgress } from '../controllers/progressController.js'

const router = express.Router()

router.get('/:courseId',  protect, getProgress)
router.put('/:courseId',  protect, updateProgress)

export default router
