const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index für schnellere Abfragen
commentSchema.index({ household_id: 1, created_at: -1 });
commentSchema.index({ product_id: 1 });

module.exports = mongoose.model('Comment', commentSchema);
