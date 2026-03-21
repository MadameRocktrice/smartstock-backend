const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  min_quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  expiration_date: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Automatisch updated_at aktualisieren
productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index für schnellere Abfragen
productSchema.index({ household_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ location_id: 1 });

module.exports = mongoose.model('Product', productSchema);
