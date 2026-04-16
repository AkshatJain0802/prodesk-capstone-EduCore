import Stripe from 'stripe'
import Purchase from '../models/Purchase.js'
import Course from '../models/Course.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// POST /api/purchase — create Stripe checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    // Check if already enrolled
    const existing = await Purchase.findOne({
      userId: req.user._id, courseId, status: 'paid'
    })
    if (existing) return res.status(400).json({ message: 'Already enrolled' })

    // Create pending purchase record
    const purchase = await Purchase.create({
      userId: req.user._id,
      courseId,
      amount: course.price,
      status: 'pending',
    })

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: course.title,
            images: [course.thumbnail],
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
      metadata: { purchaseId: purchase._id.toString(), courseId },
    })

    res.json({ success: true, sessionUrl: session.url })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
