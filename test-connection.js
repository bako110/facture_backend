/**
 * Script de test de connexion
 * Vérifie que le serveur et MongoDB fonctionnent correctement
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Test de connexion...\n');

// Test 1: Variables d'environnement
console.log('1️⃣ Vérification des variables d\'environnement:');
console.log(`   PORT: ${process.env.PORT || '❌ Non défini'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Défini' : '❌ Non défini'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   ALLOWED_ORIGINS: ${process.env.ALLOWED_ORIGINS || '❌ Non défini'}\n`);

// Test 2: Connexion MongoDB
console.log('2️⃣ Test de connexion MongoDB...');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI n\'est pas défini dans le fichier .env');
  console.log('\n💡 Créez un fichier .env avec:');
  console.log('   MONGODB_URI=mongodb://localhost:27017/factures_db');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connecté avec succès!');
  console.log(`   Host: ${mongoose.connection.host}`);
  console.log(`   Database: ${mongoose.connection.name}\n`);
  
  console.log('3️⃣ Test des collections:');
  return mongoose.connection.db.listCollections().toArray();
})
.then((collections) => {
  if (collections.length === 0) {
    console.log('   ℹ️  Aucune collection trouvée (base de données vide)');
    console.log('   Les collections seront créées automatiquement lors de la première insertion\n');
  } else {
    console.log(`   ✅ ${collections.length} collection(s) trouvée(s):`);
    collections.forEach(col => {
      console.log(`      - ${col.name}`);
    });
    console.log('');
  }
  
  console.log('✅ Tous les tests sont passés!');
  console.log('\n🚀 Vous pouvez maintenant démarrer le serveur avec:');
  console.log('   npm run dev\n');
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Erreur de connexion MongoDB:', error.message);
  console.log('\n💡 Solutions possibles:');
  console.log('   1. Vérifiez que MongoDB est démarré (commande: mongod)');
  console.log('   2. Vérifiez l\'URI dans le fichier .env');
  console.log('   3. Si vous utilisez MongoDB Atlas, vérifiez:');
  console.log('      - Que votre IP est autorisée');
  console.log('      - Que les identifiants sont corrects');
  console.log('      - Que l\'URI est au bon format\n');
  
  process.exit(1);
});
