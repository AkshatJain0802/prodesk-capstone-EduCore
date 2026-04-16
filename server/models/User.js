import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId:   { type: String, required: true, unique: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  imageUrl:  { type: String, default: '' },
  role:      { type: String, enum: ['student', 'educator'], default: 'student' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
