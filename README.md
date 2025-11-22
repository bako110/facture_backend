# Backend API - Gestion de Factures

Backend Node.js/Express robuste pour l'application de gestion de factures avec base de données MongoDB.

## 🚀 Fonctionnalités

- ✅ API RESTful complète
- ✅ Base de données MongoDB avec Mongoose
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ CORS configuré
- ✅ Sécurité avec Helmet
- ✅ Compression des réponses
- ✅ Logging avec Morgan
- ✅ Variables d'environnement

## 📋 Prérequis

- Node.js >= 14.x
- MongoDB >= 4.x (local ou Atlas)
- npm ou yarn

## 🛠️ Installation

### 1. Installer les dépendances

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` à la racine du dossier backend :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/factures_db
JWT_SECRET=votre_cle_secrete_tres_forte
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

### 3. Démarrer MongoDB

**Option A: MongoDB Local**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Créez un cluster gratuit
- Obtenez votre URI de connexion
- Mettez à jour `MONGODB_URI` dans `.env`

### 4. Tester la connexion (Optionnel mais recommandé)

Avant de démarrer le serveur, testez que tout est bien configuré :

```bash
npm run test-connection
```

Ce script vérifie :
- ✅ Les variables d'environnement
- ✅ La connexion à MongoDB
- ✅ Les collections existantes

### 5. Démarrer le serveur

**Mode développement (avec auto-reload):**
```bash
npm run dev
```

**Mode production:**
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📡 Endpoints API

### Health Check

```
GET /api/health
```

Vérifie l'état du serveur.

**Réponse:**
```json
{
  "status": "OK",
  "message": "Serveur opérationnel",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

### Produits

#### Récupérer tous les produits
```
GET /api/products
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "name": "Produit A",
      "reference": "REF-001",
      "unitPrice": 1000,
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Récupérer un produit
```
GET /api/products/:id
```

#### Créer un produit
```
POST /api/products
Content-Type: application/json

{
  "id": "1234567890",
  "name": "Produit A",
  "reference": "REF-001",
  "unitPrice": 1000,
  "stock": 50
}
```

#### Mettre à jour un produit
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Produit A Modifié",
  "unitPrice": 1200
}
```

#### Supprimer un produit
```
DELETE /api/products/:id
```

---

### Clients

#### Récupérer tous les clients
```
GET /api/clients
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "name": "Client A",
      "address": "123 Rue Example",
      "phone": "+226 XX XX XX XX",
      "email": "client@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Récupérer un client
```
GET /api/clients/:id
```

#### Créer un client
```
POST /api/clients
Content-Type: application/json

{
  "id": "1234567890",
  "name": "Client A",
  "address": "123 Rue Example",
  "phone": "+226 XX XX XX XX",
  "email": "client@example.com"
}
```

#### Mettre à jour un client
```
PUT /api/clients/:id
Content-Type: application/json

{
  "name": "Client A Modifié",
  "phone": "+226 YY YY YY YY"
}
```

#### Supprimer un client
```
DELETE /api/clients/:id
```

---

### Factures

#### Récupérer toutes les factures
```
GET /api/invoices
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "invoiceNumber": "FAC-00001",
      "date": "2024-01-01T00:00:00.000Z",
      "client": {
        "id": "client123",
        "name": "Client A",
        "address": "123 Rue Example",
        "phone": "+226 XX XX XX XX"
      },
      "items": [
        {
          "productId": "prod123",
          "productName": "Produit A",
          "productReference": "REF-001",
          "quantity": 2,
          "unitPrice": 1000,
          "total": 2000
        }
      ],
      "subtotal": 2000,
      "tva": 360,
      "total": 2360,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Récupérer une facture
```
GET /api/invoices/:id
```

#### Créer une facture
```
POST /api/invoices
Content-Type: application/json

{
  "id": "1234567890",
  "invoiceNumber": "FAC-00001",
  "date": "2024-01-01T00:00:00.000Z",
  "client": {
    "id": "client123",
    "name": "Client A",
    "address": "123 Rue Example",
    "phone": "+226 XX XX XX XX"
  },
  "items": [
    {
      "productId": "prod123",
      "productName": "Produit A",
      "productReference": "REF-001",
      "quantity": 2,
      "unitPrice": 1000,
      "total": 2000
    }
  ],
  "subtotal": 2000,
  "tva": 360,
  "total": 2360
}
```

#### Statistiques des factures
```
GET /api/invoices/stats/summary
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "totalInvoices": 150,
    "totalRevenue": 1500000
  }
}
```

---

## 🗄️ Structure de la Base de Données

### Collection: products
```javascript
{
  id: String (unique, indexed),
  name: String (required),
  reference: String (required, indexed),
  unitPrice: Number (required, min: 0),
  stock: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: clients
```javascript
{
  id: String (unique, indexed),
  name: String (required),
  address: String (required),
  phone: String,
  email: String (validated),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: invoices
```javascript
{
  id: String (unique, indexed),
  invoiceNumber: String (unique, indexed),
  date: Date (required),
  client: {
    id: String,
    name: String,
    address: String,
    phone: String,
    email: String
  },
  items: [{
    productId: String,
    productName: String,
    productReference: String,
    quantity: Number (min: 1),
    unitPrice: Number (min: 0),
    total: Number (min: 0)
  }],
  subtotal: Number (required, min: 0),
  tva: Number (required, min: 0),
  total: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Sécurité

- **Helmet**: Protection contre les vulnérabilités web courantes
- **CORS**: Contrôle d'accès cross-origin
- **Validation**: Validation des données avec express-validator
- **Limites**: Limitation de la taille des requêtes
- **Variables d'environnement**: Configuration sécurisée

## 🧪 Tests avec Postman/Thunder Client

### Importer la collection

Créez une nouvelle collection avec les endpoints ci-dessus.

### Variables d'environnement

```
BASE_URL = http://localhost:3000
```

### Exemples de requêtes

**Créer un produit:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1234567890",
    "name": "Fer à béton 10mm",
    "reference": "FER-10",
    "unitPrice": 5000,
    "stock": 100
  }'
```

**Récupérer tous les produits:**
```bash
curl http://localhost:3000/api/products
```

## 📊 Monitoring

### Logs

Les logs sont affichés dans la console en mode développement.

### Santé du serveur

Vérifiez régulièrement `/api/health` pour surveiller l'état du serveur.

## 🚀 Déploiement

### Heroku

```bash
# Installer Heroku CLI
heroku login
heroku create nom-de-votre-app
heroku addons:create mongolab:sandbox
git push heroku main
```

### Railway

1. Connectez votre repo GitHub
2. Ajoutez les variables d'environnement
3. Railway détecte automatiquement Node.js
4. Déploiement automatique

### DigitalOcean App Platform

1. Créez une nouvelle app
2. Connectez votre repo
3. Configurez les variables d'environnement
4. Déployez

## 🛠️ Développement

### Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuration MongoDB
│   ├── models/
│   │   ├── Product.js        # Modèle Produit
│   │   ├── Client.js         # Modèle Client
│   │   └── Invoice.js        # Modèle Facture
│   ├── routes/
│   │   ├── products.js       # Routes produits
│   │   ├── clients.js        # Routes clients
│   │   ├── invoices.js       # Routes factures
│   │   └── auth.js           # Routes authentification
│   └── server.js             # Point d'entrée
├── .env                      # Variables d'environnement
├── .env.example              # Exemple de configuration
├── .gitignore
├── package.json
└── README.md
```

### Ajouter de nouvelles fonctionnalités

1. Créez un nouveau modèle dans `src/models/`
2. Créez les routes dans `src/routes/`
3. Enregistrez les routes dans `src/server.js`
4. Testez avec Postman

## 🐛 Dépannage

### Erreur de connexion MongoDB

```
❌ Erreur de connexion MongoDB: connect ECONNREFUSED
```

**Solution:**
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `.env`
- Vérifiez les permissions réseau (Atlas)

### Port déjà utilisé

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Erreurs CORS

**Solution:**
Ajoutez l'origine de votre application dans `ALLOWED_ORIGINS` dans `.env`

## 📝 Licence

MIT

## 👨‍💻 Auteur

Développé pour l'application de gestion de factures

---

**🎉 Votre backend est prêt à recevoir les données de l'application mobile !**
#   f a c t u r e _ b a c k e n d  
 