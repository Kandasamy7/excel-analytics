const express = require('express')
const { register, login, getMe } = require('../controllers/authController')
const router = express.Router()

router.post('/register', register) //Register route
router.post('/login', login) //Login route
router.get('/me', getMe)

module.exports = router 