const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(5)                               // Minimum length 5
    .is().max(50)                              // Maximum length 50
    .has().uppercase()                         // Must have uppercase letters
    .has().lowercase()                         // Must have lowercase letters
    .has().not().spaces()                      // Should not have spaces
    .has().digits()                            // Must have at least 1 digit
    .has().not().symbols();

module.exports = passwordSchema;