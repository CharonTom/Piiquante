const Sauce = require("../models/Sauces");
const fs = require("fs");

// ajouter une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save() // enregistrement de l'objet dans la db
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        // Si il y a une image on traite l'image et la requête
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // sinon on traite juste l'objet entrant

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Supression de l'image dans le disque
          Sauce.deleteOne({ _id: req.params.id }) // Supression de l'objet dans la db
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// lire toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// lire une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// like une sauce
exports.useLike = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId; // récupération du userID par la requête
  const like = req.body.like; // récupération du like par la requête

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // si l'user n'a pas voté avant et vote positivement

      if (!sauce.usersLiked.includes(userId) && like === 1) {
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: req.body.like++ },
            $push: { usersLiked: userId },
          }
        )
          .then((sauce) => res.status(200).json({ message: "Sauce likée !" }))
          .catch((error) => res.status(400).json({ error }));

        // si l'user a voté positivement et veut annuler son vote
      } else if (sauce.usersLiked.includes(userId) && like === 0) {
        Sauce.updateOne(
          { _id: sauceId },
          { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
        )
          .then((sauce) => {
            res.status(200).json({ message: "Like enlevé !" });
          })
          .catch((error) => res.status(400).json({ error }));

        // si l'user a voté négativement et veut annuler son vote
      } else if (sauce.usersDisliked.includes(userId) && like === 0) {
        Sauce.updateOne(
          { _id: sauceId },
          {
            $pull: { usersDisliked: userId },
            $inc: { dislikes: -1 },
          }
        )
          .then((sauce) => {
            res.status(200).json({ message: "dislike enlevé !" });
          })
          .catch((error) => res.status(400).json({ error }));

        // si l'user n'a pas voté avant et vote négativement
      } else if (!sauce.usersDisliked.includes(userId) && like === -1) {
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId },
          }
        )
          .then((sauce) =>
            res.status(200).json({ message: "Sauce dislikée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(400).json({ message: "Vote impossible" });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
