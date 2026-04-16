import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getProfile, updateRole, getEnrollments } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile',     protect, getProfile)
router.put('/role',        protect, updateRole)
router.get('/enrollments', protect, getEnrollments)

export default router
