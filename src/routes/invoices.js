const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Invoice = require('../models/Invoice');

/**
 * @route   GET /api/invoices
 * @desc    Récupérer toutes les factures
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   GET /api/invoices/:id
 * @desc    Récupérer une facture par ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Facture non trouvée'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   POST /api/invoices
 * @desc    Créer une nouvelle facture
 * @access  Public
 */
router.post('/', [
  body('id').notEmpty().withMessage('L\'ID est requis'),
  body('invoiceNumber').trim().notEmpty().withMessage('Le numéro de facture est requis'),
  body('client').notEmpty().withMessage('Le client est requis'),
  body('client.id').notEmpty().withMessage('L\'ID du client est requis'),
  body('client.name').trim().notEmpty().withMessage('Le nom du client est requis'),
  body('client.address').trim().notEmpty().withMessage('L\'adresse du client est requise'),
  body('items').isArray({ min: 1 }).withMessage('La facture doit contenir au moins un article'),
  body('subtotal').isNumeric().withMessage('Le sous-total doit être un nombre'),
  body('tva').isNumeric().withMessage('La TVA doit être un nombre'),
  body('total').isNumeric().withMessage('Le total doit être un nombre')
], async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: errors.array()
    });
  }

  try {
    const { id, invoiceNumber, date, client, items, subtotal, tva, total } = req.body;

    // Vérifier si la facture existe déjà
    let invoice = await Invoice.findOne({ id });
    if (invoice) {
      return res.status(409).json({
        success: false,
        error: 'Une facture avec cet ID existe déjà'
      });
    }

    // Vérifier si le numéro de facture existe déjà
    invoice = await Invoice.findOne({ invoiceNumber });
    if (invoice) {
      return res.status(409).json({
        success: false,
        error: 'Une facture avec ce numéro existe déjà'
      });
    }

    // Créer la facture
    invoice = new Invoice({
      id,
      invoiceNumber,
      date: date || new Date(),
      client,
      items,
      subtotal,
      tva,
      total
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   GET /api/invoices/stats/summary
 * @desc    Obtenir les statistiques des factures
 * @access  Public
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalInvoices,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;
