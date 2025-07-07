const File = require('../models/File')
const User = require('../models/User')

const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' })
    }

    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalFiles = await File.countDocuments()

    res.json({ totalUsers, totalFiles })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats' })
  }
}

module.exports = { getAdminStats }
