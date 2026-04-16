import { Webhook } from 'svix'
import User from '../models/User.js'

export const clerkWebhookHandler = async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  let evt

  try {
    const payload = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body)

    evt = wh.verify(payload, {
      'svix-id':        req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    })
  } catch (err) {
    console.error('Clerk webhook verification failed:', err.message)
    return res.status(400).json({ message: 'Webhook verification failed' })
  }

  const { type, data } = evt

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const { id, first_name, last_name, email_addresses, image_url } = data
      const email = email_addresses?.[0]?.email_address

      await User.findOneAndUpdate(
        { clerkId: id },
        { name: `${first_name || ''} ${last_name || ''}`.trim(), email, imageUrl: image_url },
        { upsert: true, new: true }
      )

      console.log(`Clerk webhook synced user ${id} (${type})`)
    }

    if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id })
      console.log(`Clerk webhook deleted user ${data.id}`)
    }

    return res.json({ received: true })
  } catch (err) {
    console.error('Clerk webhook DB sync error:', err.message)
    return res.status(500).json({ message: 'Webhook DB sync failed' })
  }
}
