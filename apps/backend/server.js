const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const User = require('./models/User'); // ✅ Make sure the path is correct

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // In production, replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => res.send('API is running...'));

//  Function to create default admin
async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await admin.save();
      console.log(' Default admin user created');
    } else {
      console.log('ℹ Admin already exists');
    }
  } catch (err) {
    console.error(' Error creating default admin:', err.message);
  }
}

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    createDefaultAdmin(); // ✅ Call admin creation function
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
