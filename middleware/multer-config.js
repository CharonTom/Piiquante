const multer = require('multer');

// Middleware mutler pour la gestion des images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension); // Création du nom du fichier avec extension
    }
});


const fileFilter = (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype]; 
    if (extension === "jpg" || extension === "png") {  // On vérifie que le fichier est un jpg ou un png
        callback(null, true); 
    } else {
        callback("Erreur : Mauvais type de fichier", false);
    }
};

module.exports = multer({ storage, limits: { fileSize: 104857600 }, fileFilter, }).single("image");

