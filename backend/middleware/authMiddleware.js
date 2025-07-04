const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware to protect routes by checking for a valid JWT token
exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Add user to req object, including their role
      req.user = await User.findById(decoded.id).select('-password')
      req.user.role = decoded.role // ✅ force role into req.user

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }

      return next()  // Token valid, user exists — proceed
    } catch (error) {
      console.error('Token verification error:', error)
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  // No token found
  return res.status(401).json({ message: 'Not authorized, no token' })
}

