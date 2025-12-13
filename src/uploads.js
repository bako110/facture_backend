const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

class UploadService {
  constructor() {
    this.cloudinaryInitialized = false;
    this.initCloudinary();
  }

  // Initialiser Cloudinary
  async initCloudinary() {
    try {
      console.log('🔄 Initialisation Cloudinary...');
      
      // Vérifier si les variables d'environnement sont configurées
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn('⚠️  Variables Cloudinary non configurées');
        console.warn('⚠️  Définissez: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
        this.cloudinaryInitialized = false;
        return;
      }
      
      // Configurer Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      
      this.cloudinaryInitialized = true;
      console.log('✅ Cloudinary initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation Cloudinary:', error.message);
      this.cloudinaryInitialized = false;
    }
  }

  // Upload PDF vers Cloudinary
  async uploadPDF(req, res) {
    try {
      const { pdfBase64, fileName, invoiceData = {} } = req.body;

      // Validation
      if (!pdfBase64 || !fileName) {
        return res.status(400).json({
          success: false,
          error: 'pdfBase64 et fileName sont requis'
        });
      }

      if (!this.cloudinaryInitialized) {
        return res.status(503).json({
          success: false,
          error: 'Cloudinary non disponible - vérifiez les credentials'
        });
      }

      console.log(`📥 Upload PDF: ${fileName}`);
      
      // Upload vers Cloudinary
      const result = await this.uploadToCloudinary(pdfBase64, fileName, invoiceData);

      res.json({
        success: true,
        message: 'PDF sauvegardé sur Cloudinary',
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erreur upload PDF',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Upload le fichier à Cloudinary
  async uploadToCloudinary(pdfBase64, fileName, invoiceData) {
    let tempFilePath = null;
    
    try {
      // Créer dossier temp s'il n'existe pas
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Créer fichier temporaire
      tempFilePath = path.join(tempDir, `${Date.now()}_${fileName}`);
      const buffer = Buffer.from(pdfBase64, 'base64');
      fs.writeFileSync(tempFilePath, buffer);

      // Upload vers Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'raw',
        folder: 'factures',
        public_id: fileName.replace(/\.[^/.]+$/, ''),
        description: this.generateDescription(invoiceData),
      });

      console.log(`✅ PDF uploadé: ${result.public_id}`);
      console.log(`🔗 Lien: ${result.secure_url}`);

      return {
        fileId: result.public_id,
        fileName: fileName,
        fileUrl: result.secure_url,
        size: result.bytes,
        createdTime: new Date().toISOString(),
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName
      };
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      throw error;
    } finally {
      // Supprimer le fichier temporaire
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.warn('⚠️  Impossible de supprimer le fichier temp');
        }
      }
    }
  }

  // Générer description pour la facture
  generateDescription(invoiceData) {
    const parts = [];
    
    if (invoiceData.invoiceNumber) {
      parts.push(`Facture: ${invoiceData.invoiceNumber}`);
    }
    
    if (invoiceData.clientName) {
      parts.push(`Client: ${invoiceData.clientName}`);
    }
    
    if (invoiceData.total) {
      parts.push(`Total: ${invoiceData.total} CFA`);
    }
    
    if (invoiceData.date) {
      parts.push(`Date: ${invoiceData.date}`);
    }
    
    return parts.join(' - ') || 'Facture PDF';
  }
}

// Exporter une instance singleton
const uploadService = new UploadService();
module.exports = uploadService;