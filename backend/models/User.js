// Importation de mongoose
const mongoose = require('mongoose');

// Package pour vérifié que l'email n'est pas déjà enregistré
const uniqueValidator = require('mongoose-unique-validator');
// Package qui purifie les champs du model avant de les enregistrer dans la base MongoDB (cela évite une injection de code malveillant)
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// Structure du schéma user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', userSchema);