const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sort_order: {
    type: Number,
    default: 0
  }
});

// Index für schnellere Abfragen
categorySchema.index({ household_id: 1, sort_order: 1 });

module.exports = mongoose.model('Category', categorySchema);
