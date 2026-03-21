const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  change_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['verbraucht', 'aufgefüllt', 'erstellt', 'bearbeitet', 'gelöscht'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index für schnellere Abfragen
historySchema.index({ product_id: 1, created_at: -1 });
historySchema.index({ user_id: 1 });

module.exports = mongoose.model('History', historySchema);
