const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Client = require('../models/Client');

/**
 * @route   GET /api/clients
 * @desc    Récupérer tous les clients
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   GET /api/clients/:id
 * @desc    Récupérer un client par ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   POST /api/clients
 * @desc    Créer un nouveau client
 * @access  Public
 */
router.post('/', [
  body('id').notEmpty().withMessage('L\'ID est requis'),
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('address').trim().notEmpty().withMessage('L\'adresse est requise'),
  body('email').optional().isEmail().withMessage('Email invalide')
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
    const { id, name, address, phone, email } = req.body;

    // Vérifier si le client existe déjà
    let client = await Client.findOne({ id });
    if (client) {
      return res.status(409).json({
        success: false,
        error: 'Un client avec cet ID existe déjà'
      });
    }

    // Créer le client
    client = new Client({
      id,
      name,
      address,
      phone,
      email
    });

    await client.save();

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   PUT /api/clients/:id
 * @desc    Mettre à jour un client
 * @access  Public
 */
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('address').optional().trim().notEmpty().withMessage('L\'adresse ne peut pas être vide'),
  body('email').optional().isEmail().withMessage('Email invalide')
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
    const client = await Client.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   DELETE /api/clients/:id
 * @desc    Supprimer un client
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Client supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;
