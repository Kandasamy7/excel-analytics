const express = require('express')
const multer = require('multer')
const { protect } = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const {
  uploadExcel,
  getUploadHistory,
  getFileData,
  deleteFileById,
  downloadFile,
  getAllUploads,
  deleteFileAsAdmin
} = require('../controllers/fileController')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

// ✅ Test protected route
router.get('/test', protect, (req, res) => {
  res.json({
    message: 'Token is valid and user is authenticated',
    user: req.user
  })
})

// ✅ User Routes
router.post('/upload', protect, upload.single('file'), uploadExcel)
router.get('/history', protect, getUploadHistory)
router.get('/data/:id', protect, getFileData)
router.get('/download/:id', protect, downloadFile)
router.delete('/:id', protect, deleteFileById) // Handles user & admin delete

// ✅ Admin-only Routes
router.get('/all-uploads', protect, isAdmin, getAllUploads)
router.delete('/admin/:id', protect, isAdmin, deleteFileAsAdmin)

module.exports = router
