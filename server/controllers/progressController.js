import CourseProgress from '../models/CourseProgress.js'
import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'

// GET /api/progress/:courseId
export const getProgress = async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      userId: req.user._id, courseId: req.params.courseId
    })
    res.json({ success: true, progress: progress || null })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUT /api/progress/:courseId  — mark lecture done
export const updateProgress = async (req, res) => {
  try {
    const { lectureId } = req.body
    const { courseId } = req.params

    // Verify enrollment
    const purchase = await Purchase.findOne({ userId: req.user._id, courseId, status: 'paid' })
    if (!purchase) return res.status(403).json({ message: 'Not enrolled in this course' })

    const course = await Course.findById(courseId)
    const totalLectures = course.chapters.reduce((sum, ch) => sum + ch.lectures.length, 0)

    let progress = await CourseProgress.findOne({ userId: req.user._id, courseId })
    if (!progress) {
      progress = new CourseProgress({ userId: req.user._id, courseId })
    }

    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId)
    }
    progress.lastWatchedId = lectureId
    progress.completionPercent = Math.round((progress.completedLectures.length / totalLectures) * 100)

    await progress.save()
    res.json({ success: true, progress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
