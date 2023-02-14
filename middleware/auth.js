const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récuperation du Token dans la reqûete
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // On regarde si ça match
        const userId = decodedToken.userId; // Nous extrayons le userId de notre token et le rajoutons à 
        req.auth = {                        // l’objet Request afin que nos différentes routes puissent l’exploiter
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
};