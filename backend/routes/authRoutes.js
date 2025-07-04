const express = require('express')
const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register', register) //Register route
router.post('/login', login) //Login route
router.get('/me', protect, getMe)

module.exports = router 