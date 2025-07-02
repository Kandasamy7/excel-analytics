const express = require('express')
const multer = require('multer')
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const { uploadExcel, getUploadHistory, getFileData } = require('../controllers/fileController')
const File = require('../models/File') // ✅ required for admin route

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/test', protect, (req, res) => {
  res.json({
    message: 'Token is valid and user is authenticated',
    user: req.user
  })
})

router.get('/history', protect, getUploadHistory)
router.get('/data/:id', protect, getFileData)
router.post('/upload', protect, upload.single('file'), uploadExcel)

// ✅ Admin-only route
router.get('/all-uploads', protect, isAdmin, async (req, res) => {
  try {
    const files = await File.find().populate('user', 'email')
    res.status(200).json({ files })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching uploads' })
  }
})

module.exports = router
