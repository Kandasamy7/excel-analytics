const express = require('express')
const router = express.Router()
const {
  getUserStats
} = require('../controllers/userController')
const {
  getUploadHistory,
  downloadFile,
  deleteFileById
} = require('../controllers/fileController')
const { protect } = require('../middleware/authMiddleware')

// User dashboard stats
router.get('/stats', protect, getUserStats)

// Upload history (list of files for current user)
router.get('/history', protect, getUploadHistory)

// Delete file by ID (user only)
router.delete('/:id', protect, deleteFileById)

// Download Excel file
router.get('/download/:id', protect, downloadFile)

module.exports = router
