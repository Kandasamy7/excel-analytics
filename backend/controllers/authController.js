const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs') // password hashing
const User = require('../models/User') 

// Genetate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d' //token validity
    })
}

//Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email })
        if(userExists) {
            return res.status(400).json({ message : 'User already exists' })
        }

        const hashed = await bcrypt.hash(password, 10) //hash the password
        const user = await User.create({
            name,
            email,
            password: hashed
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.role) //generate token
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({ message : 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password) //compare password
        if(!isMatch) {
            return res.status(401).json({ message : 'Invalid credentials' })
        }
        // if user exists and pass matches, generate token and send response
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.role) 
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
// Get user profile
exports.getMe = async (req, res) => {
  const user = req.user // This is set by the authMiddleware
  if (!user) return res.status(401).json({ message: 'User not found' })
  res.status(200).json(user)
}
