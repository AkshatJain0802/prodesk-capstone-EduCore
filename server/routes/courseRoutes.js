import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { protect, educatorOnly } from '../middleware/authMiddleware.js'
import {
  getAllCourses, getCourseById, createCourse,
  getEducatorCourses, togglePublish, addChapter, addLecture
} from '../controllers/courseController.js'

const router = express.Router()

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'educore',
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
  }),
})
const upload = multer({ storage })

router.get('/',           getAllCourses)
router.get('/:id',        getCourseById)
router.post('/',          protect, educatorOnly, upload.single('thumbnail'), createCourse)
router.put('/:id/publish',protect, educatorOnly, togglePublish)
router.post('/:id/chapters', protect, educatorOnly, addChapter)
router.post('/:id/chapters/:chapterId/lectures', protect, educatorOnly, upload.single('video'), addLecture)
router.get('/educator/my-courses', protect, educatorOnly, getEducatorCourses)

export default router
