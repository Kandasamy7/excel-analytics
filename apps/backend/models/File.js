// This file defines the Mongoose schema for the file model
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  originalName: String,
  data: Array, // Or a more typed version as shown above
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
