const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  reference: {
    type: String,
    required: [true, 'La référence est requise'],
    trim: true,
    index: true
  },
  unitPrice: {
    type: Number,
    required: [true, 'Le prix unitaire est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  }
}, {
  timestamps: true
});

// Index pour les recherches
productSchema.index({ name: 'text', reference: 'text' });

module.exports = mongoose.model('Product', productSchema);
