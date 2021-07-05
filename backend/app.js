const express = require('express'); // Importation d'express = Framework basé sur node.js
const helmet = require('helmet') // couteau suisse ajoutant 11 middlewares de sécurité pour les headers HTTP // On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web)
const bodyParser = require('body-parser'); // Permet d'extraire l'objet JSON des requêtes POST
const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la data base Mongo Db
const path = require('path'); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const rateLimit = require('express-rate-limit'); // protection contre les techniques brute force en déterminant un nombre de requêtes maximum sur une période de temps prédéterminée.

//constante à utiliser avec le package rateLimit
const limiter = rateLimit({         
  windowMs: 15 * 60 * 1000,       // = 15 minutes
  max: 100
})

const app = express();
app.use(helmet());
app.use(limiter);

// mongodb+srv://Guernouloliv:03190319A@cluster0.d7fpx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://Guernouloliv:03190319A@cluster0.8meem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mise en oeuvre des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export de l'application express pour déclaration dans server.js
module.exports = app;