const express = require('express')
const multer = require('multer')
const protect = require('../middleware/authMiddleware')
const { uploadExcel } = require('../controllers/fileController')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })
router.get('/test', protect, (req, res) => {
  res.json({
    message: 'Token is valid ✅',
    user: req.user
  })
})

router.post('/upload', protect, upload.single('file'), uploadExcel)

module.exports = router
// This code sets up a route for uploading Excel files.
// it uses multer for file handling and a middleware to protect the route