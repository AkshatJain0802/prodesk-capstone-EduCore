import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema({
  userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLectures:  [{ type: mongoose.Schema.Types.ObjectId }],
  completionPercent:  { type: Number, default: 0 },
  lastWatchedId:      { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true })

export default mongoose.model('CourseProgress', courseProgressSchema)
