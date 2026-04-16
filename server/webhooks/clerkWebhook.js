import { Webhook } from 'svix'
import User from '../models/User.js'

export const clerkWebhookHandler = async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  let evt 

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id':        req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    })
  } catch (err) {
    return res.status(400).json({ message: 'Webhook verification failed' })
  }

  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = data
    const email = email_addresses?.[0]?.email_address

    await User.findOneAndUpdate(
      { clerkId: id },
      { name: `${first_name || ''} ${last_name || ''}`.trim(), email, imageUrl: image_url },
      { upsert: true, new: true }
    )
  }

  if (type === 'user.deleted') {
    await User.findOneAndDelete({ clerkId: data.id })
  }

  res.json({ received: true })
}
