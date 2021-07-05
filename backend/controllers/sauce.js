// importer le modèle sauce
const Sauce = require('../models/Sauce');

//package qui permet de modifier ou supprimer des fichiers
const fs = require('fs');

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};

// Création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   
    });
    sauce.save()
    .then( () => res.status(201).json({ message: 'Sauce sauvegardé'}))
    .catch( error => res.status(400).json({ error }))
};

// Modification de la sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce modifié'}))
    .catch(()=> res.status(400).json({ error}))
};

// Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
    Sauce.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce supprimé'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

// Création du like et dislike
exports.likeSauce = (req, res, next) => {    
    // Si l'utilisateur aime la sauce
  if (req.body.like === 1) { 
    // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) { 
    // Si l'utilisateur n'aime pas la sauce
    // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
      .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else { 
    // Si like === 0 l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Si le tableau "userLiked" contient l'ID de l'utilisateur
        if (sauce.usersLiked.includes(req.body.userId)) { 
          // On enlève un like du tableau "userLiked" 
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            // Si le tableau "userDisliked" contient l'ID de l'utilisateur
            // On enlève un dislike du tableau "userDisliked" 
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};
