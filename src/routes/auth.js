const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Le nom d\'utilisateur est requis'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
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
    const { username, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'secret_key_change_in_production',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

/**
 * @route   GET /api/auth/health
 * @desc    Vérifier l'état de l'API d'authentification
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API d\'authentification opérationnelle'
  });
});

module.exports = router;
