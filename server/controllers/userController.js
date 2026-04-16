import User from '../models/User.js'
import Purchase from '../models/Purchase.js'
import CourseProgress from '../models/CourseProgress.js'

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    res.json({ success: true, user: req.user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUT /api/user/role  — become an educator
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['student', 'educator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    req.user.role = role
    await req.user.save()
    res.json({ success: true, user: req.user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/user/enrollments — student's purchased courses
export const getEnrollments = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id, status: 'paid' })
      .populate({ path: 'courseId', populate: { path: 'educatorId', select: 'name' } })

    const progressList = await CourseProgress.find({ userId: req.user._id })

    const enrollments = purchases.map(p => {
      const prog = progressList.find(pr => pr.courseId.toString() === p.courseId._id.toString())
      return {
        course: p.courseId,
        completionPercent: prog?.completionPercent || 0,
        lastWatchedId: prog?.lastWatchedId || null,
      }
    })

    res.json({ success: true, enrollments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
