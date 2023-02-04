const express = require('express');
const router = express.Router();
const passwordCheck = require("../middleware/password");
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit');

const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
    max: 3 // essais max par adresse ip
});


router.post('/signup', passwordCheck, userCtrl.signup);
router.post('/login', passLimiter, userCtrl.login);

module.exports = router;