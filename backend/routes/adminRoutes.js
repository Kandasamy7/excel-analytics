const express = require('express')
const router = express.Router()
const { deleteFileAsAdmin, getAllUploads } = require('../controllers/fileController')
const { protect } = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const { getAdminStats } = require('../controllers/adminController')


router.get('/stats', protect, isAdmin, getAdminStats)
router.get('/all-uploads', protect, isAdmin, getAllUploads)
router.delete('/delete/:id', protect, isAdmin, deleteFileAsAdmin)  // ✅ This is critical

module.exports = router