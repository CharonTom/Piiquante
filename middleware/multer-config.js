const multer = require('multer');

// Middleware mutler pour la gestion des images
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/tif": "tif",
    "image/webp": "webp"
};
// multer.diskStorage on enregistre sur le disque
const storage = multer.diskStorage({
    // on choisit la destination
    destination: (req, file, callback) => {
        callback(null, 'images'); // null dit qu'il ny a pas d'erreur et 'images' le nom du dossier
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension); // Création du nom du fichier avec extension
    }
});

// On vérifie que le fichier est bien une image
const fileFilter = (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    if (extension === "jpeg" ||
        extension === "png" ||
        extension === "jpg" ||
        extension === "bmp" ||
        extension === "gif" ||
        extension === "ico" ||
        extension === "svg" ||
        extension === "tiff" ||
        extension === "tif" ||
        extension === "webp") {
        callback(null, true);
    } else {
        callback("Erreur : Mauvais type de fichier", false);
    }
};
// on exporte le fichier via multer qui possede l'objet storage puis
// on impose une taille maximal de fichier et single signifie fichier unique

module.exports = multer({ storage, limits: { fileSize: 104857600 }, fileFilter, }).single("image");

