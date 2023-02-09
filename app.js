const express = require('express');
const app = express();
const path = require('path');

//Sécurité
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const mongoSanitize = require('express-mongo-sanitize');

// Déclaration des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(express.json());

// Lancement de Helmet
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//Lancement de mongo sanitize
app.use(mongoSanitize());

// Lancement des routes
app.use('/images', express.static(path.join(__dirname, 'images'))); // permet de charger les fichiers qui sont dans le repertoire image
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;