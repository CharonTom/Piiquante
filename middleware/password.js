// import du model passwordSchema
const passwordSchema = require("../models/password");

// On regarde si le mdp de l'utilisateur match avec notre passwordSchema
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 5 caractères dont un chiffre et une majuscule, sans espaces ni symboles",
      {
        "content-type": "application/json",
      }
    );
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};