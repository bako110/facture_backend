const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productReference: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Le total ne peut pas être négatif']
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Le numéro de facture est requis'],
    unique: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  client: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    email: String
  },
  items: {
    type: [invoiceItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'La facture doit contenir au moins un article'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Le sous-total ne peut pas être négatif']
  },
  tva: {
    type: Number,
    required: true,
    min: [0, 'La TVA ne peut pas être négative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Le total ne peut pas être négatif']
  }
}, {
  timestamps: true
});

// Index pour les recherches
invoiceSchema.index({ invoiceNumber: 1, date: -1 });
invoiceSchema.index({ 'client.name': 'text' });

module.exports = mongoose.model('Invoice', invoiceSchema);
