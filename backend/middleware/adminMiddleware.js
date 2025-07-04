// backend/middleware/adminMiddleware.js

const isAdmin = (req, res, next) => {
  // console.log('🧠 isAdmin check:', req.user?.role) // Log role for debugging

  if (req.user && req.user.role === 'admin') {
    return next()
  }

  return res.status(403).json({ message: 'Access denied. Admins only' })
}

module.exports = isAdmin
