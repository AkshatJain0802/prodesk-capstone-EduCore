import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'

// GET /api/courses — all published courses (with optional search & category filter)
export const getAllCourses = async (req, res) => {
  try {
    const { search, category } = req.query
    const filter = { isPublished: true }

    if (category && category !== 'All') filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }

    const courses = await Course.find(filter)
      .populate('educatorId', 'name imageUrl')
      .select('-chapters.lectures.videoUrl')
      .sort({ createdAt: -1 })

    res.json({ success: true, courses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/courses/:id — single course detail
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('educatorId', 'name imageUrl')

    if (!course) return res.status(404).json({ message: 'Course not found' })

    // Hide video URLs for non-enrolled students (only free lectures visible)
    const safeChapters = course.chapters.map(ch => ({
      ...ch.toObject(),
      lectures: ch.lectures.map(lec => ({
        ...lec.toObject(),
        videoUrl: lec.isFree ? lec.videoUrl : '',
      })),
    }))

    res.json({ success: true, course: { ...course.toObject(), chapters: safeChapters } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/courses — create course (educator only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body
    const thumbnail = req.file?.path || ''

    const course = await Course.create({
      title,
      description,
      category,
      price: Number(price) || 0,
      thumbnail,
      educatorId: req.user._id,
    })

    res.status(201).json({ success: true, course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/educator/courses — educator's own courses
export const getEducatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ educatorId: req.user._id })
      .sort({ createdAt: -1 })

    res.json({ success: true, courses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUT /api/courses/:id/publish — toggle publish status
export const togglePublish = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, educatorId: req.user._id })
    if (!course) return res.status(404).json({ message: 'Course not found' })

    course.isPublished = !course.isPublished
    await course.save()

    res.json({ success: true, isPublished: course.isPublished })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/courses/:id/chapters — add chapter
export const addChapter = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, educatorId: req.user._id })
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const { title, isFree } = req.body
    const order = course.chapters.length + 1

    course.chapters.push({ title, order, isFree: isFree === 'true', lectures: [] })
    await course.save()

    res.status(201).json({ success: true, course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/courses/:id/chapters/:chapterId/lectures — add lecture
export const addLecture = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, educatorId: req.user._id })
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const chapter = course.chapters.id(req.params.chapterId)
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' })

    const { title, isFree } = req.body
    const videoUrl = req.file?.path || ''
    const order = chapter.lectures.length + 1

    chapter.lectures.push({ title, videoUrl, order, isFree: isFree === 'true' })
    await course.save()

    res.status(201).json({ success: true, course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
