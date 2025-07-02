// backend/middleware/adminMiddleware.js
const isAdmin = (req, res, next) => {
  console.log('🧠 Checking admin role:', req.user.role)
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Access denied. Admins only' })
}

module.exports = isAdmin
