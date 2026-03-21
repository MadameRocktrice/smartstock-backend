const mongoose = require('mongoose');

const shoppingListItemSchema = new mongoose.Schema({
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  needed_quantity: {
    type: Number,
    required: true,
    min: 0
  },
  checked: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  purchased_at: {
    type: Date,
    default: null
  },
  purchased_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

// Index für schnellere Abfragen
shoppingListItemSchema.index({ household_id: 1, checked: 1 });

module.exports = mongoose.model('ShoppingListItem', shoppingListItemSchema);
