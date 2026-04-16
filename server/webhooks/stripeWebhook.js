import Stripe from 'stripe'
import Purchase from '../models/Purchase.js'
import Course from '../models/Course.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { purchaseId, courseId } = session.metadata

    await Purchase.findByIdAndUpdate(purchaseId, {
      status: 'paid',
      stripePaymentId: session.payment_intent,
    })

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } })
  }

  res.json({ received: true })
}
