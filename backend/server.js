const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes')

dotenv.config() // Load env variables()

const app = express() 
app.use(cors({
  origin: '*', // or your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json()) 

// Routes
app.use('/api/auth', authRoutes) 
app.use('/api/file' , fileRoutes)

app.get('/', (req, res) => res.send('API is running...')) // Test route

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => 
            console.log('Server running'))
    })
    .catch(err => console.log((err)));
