const multer = require('multer');
const path = require('path');

// Configuration de multer pour stocker les fichiers dans un dossier 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images/villes-images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;