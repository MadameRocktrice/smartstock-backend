const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
