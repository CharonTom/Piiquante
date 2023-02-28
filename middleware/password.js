// import du model passwordSchema
const passwordSchema = require("../models/password");

// on regarde si le mdp de l'utilisateur match avec notre passwordSchema
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({ error: 'Le format du mot de passe est incorrecte. Celui-ci doit contenir entre 5 et 50 caractères, au moins une lettre majuscule et minuscule ainsi que 1 chiffre. Il ne doit pas avoir de caractère spéciaux.' });
  
  } else {
    next();
  }
};