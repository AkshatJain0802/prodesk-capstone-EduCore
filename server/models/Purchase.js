import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount:          { type: Number, required: true },
  stripePaymentId: { type: String, unique: true, sparse: true },
  status:          { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Purchase', purchaseSchema)
