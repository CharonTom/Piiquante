// import du model passwordSchema
const passwordSchema = require("../models/password");

// on regarde si le mdp de l'utilisateur match avec notre passwordSchema
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({ error: 'Le format du mot de passe est incorrect' });
  } else {
    next();
  }
};