import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  videoUrl:  { type: String, default: '' },
  duration:  { type: Number, default: 0 },
  order:     { type: Number, required: true },
  isFree:    { type: Boolean, default: false },
})

const chapterSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  order:    { type: Number, required: true },
  isFree:   { type: Boolean, default: false },
  lectures: [lectureSchema],
})

const courseSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String, default: '' },
  educatorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:      { type: String, default: 'General' },
  price:         { type: Number, default: 0 },
  thumbnail:     { type: String, default: '' },
  isPublished:   { type: Boolean, default: false },
  rating:        { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  chapters:      [chapterSchema],
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
