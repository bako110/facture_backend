const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Récupérer tous les produits
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Récupérer un produit par ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Créer un nouveau produit
 * @access  Public
 */
router.post('/', [
  body('id').notEmpty().withMessage('L\'ID est requis'),
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('reference').trim().notEmpty().withMessage('La référence est requise'),
  body('unitPrice').isNumeric().withMessage('Le prix doit être un nombre'),
  body('stock').isNumeric().withMessage('Le stock doit être un nombre')
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
    const { id, name, reference, unitPrice, stock } = req.body;

    // Vérifier si le produit existe déjà
    let product = await Product.findOne({ id });
    if (product) {
      return res.status(409).json({
        success: false,
        error: 'Un produit avec cet ID existe déjà'
      });
    }

    // Créer le produit
    product = new Product({
      id,
      name,
      reference,
      unitPrice,
      stock
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Mettre à jour un produit
 * @access  Public
 */
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('reference').optional().trim().notEmpty().withMessage('La référence ne peut pas être vide'),
  body('unitPrice').optional().isNumeric().withMessage('Le prix doit être un nombre'),
  body('stock').optional().isNumeric().withMessage('Le stock doit être un nombre')
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
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Supprimer un produit
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;
