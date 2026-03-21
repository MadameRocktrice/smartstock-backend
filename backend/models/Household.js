const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  invite_code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Automatisch Invite-Code generieren wenn nicht vorhanden
householdSchema.pre('save', function(next) {
  if (!this.invite_code) {
    this.invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Household', householdSchema);
