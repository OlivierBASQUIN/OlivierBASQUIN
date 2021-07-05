const passwordSchema = require('../models/password');


// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        //return res.status(400,"entre 8 et 10 caractères. Au moins 1 Majuscule et 1 chiffre").send({message: 'Mot de passe non sécurisé ! ' + passwordSchema.validate(req.body.password, {list:true})});
        res.writeHead(400, '{"message":"Mot de passe requis : entre 8 et 10 caractères. Au moins 1 Majuscule et 1 chiffre"}', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};