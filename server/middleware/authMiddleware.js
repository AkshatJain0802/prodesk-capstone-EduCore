import { verifyToken } from '@clerk/express'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = await verifyToken(token)
    const user = await User.findOne({ clerkId: payload.sub })

    if (!user) {
      return res.status(401).json({ message: 'User not found in database' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}

export const educatorOnly = (req, res, next) => {
  if (req.user?.role !== 'educator') {
    return res.status(403).json({ message: 'Access denied — educators only' })
  }
  next()
}
