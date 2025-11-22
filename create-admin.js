/**
 * Script pour créer un utilisateur administrateur
 * Usage: node create-admin.js <username> <password>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async (username, password) => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`❌ L'utilisateur "${username}" existe déjà`);
      process.exit(1);
    }

    // Créer l'utilisateur
    const user = new User({
      username,
      password
    });

    await user.save();
    console.log(`✅ Utilisateur "${username}" créé avec succès!`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Créé le: ${user.createdAt}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

// Récupérer les arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage: node create-admin.js <username> <password>');
  console.log('Exemple: node create-admin.js admin monmotdepasse');
  process.exit(1);
}

const [username, password] = args;

// Validation
if (username.length < 3) {
  console.error('❌ Le nom d\'utilisateur doit contenir au moins 3 caractères');
  process.exit(1);
}

if (password.length < 4) {
  console.error('❌ Le mot de passe doit contenir au moins 4 caractères');
  process.exit(1);
}

createAdmin(username, password);
