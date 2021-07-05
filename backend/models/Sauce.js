// Importation de mongoose
const mongoose = require('mongoose');

// Package qui purifie les champs du model avant de les enregistrer dans la base MongoDB (cela évite une injection de code malveillant)
const sanitizerPlugin = require('mongoose-sanitizer-plugin');


//création du schéma de données Sauce
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: [String],
    usersDisliked: [String],
});

sauceSchema.plugin(sanitizerPlugin);


module.exports = mongoose.model('Sauce', sauceSchema);