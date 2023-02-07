const Sauce = require('../models/Sauces');
const fs = require('fs');


// Ajouter une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersDisliked: [],
        usersLiked: [],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};


// modifier une sauce
exports.modifyThing = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};



//Supprimer une sauce
exports.deleteThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


// Lire tout les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Lire une sauce
exports.getOneThing = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.useLike = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId; // récupération du userID par la requête
    const like = req.body.like;    // récupération du like par la requête
    
    // User liked the Sauce
    // Pushing user id in usersLikes array and incrementing likes by 1
    if (like === 1) {
        Sauce.updateOne(
            { _id: sauceId },
            {
                $inc: { likes: req.body.like++ },
                $push: { usersLiked: userId },
            }
        )
            .then((sauce) => res.status(200).json({ message: "Sauce liké !" }))
            .catch((error) => res.status(400).json({ error }));
    }

    // If user disliked the Sauce
    // Pushing user id in usersDislikes array and dicrementing likes by 1
    else if (like === -1) {
        Sauce.updateOne(
            { _id: sauceId },
            {
                $inc: { dislikes: req.body.like++ * -1 },
                $push: { usersDisliked: userId },
            }
        )
            .then((sauce) =>
                res.status(200).json({ message: "Sauce disliké !" })
            )
            .catch((error) => res.status(400).json({ error }));
    }

    // If user erased its opinion
    // Depending on if the urser likes or disliked the sauce beafore canceling its opinion :
    // Finding and erasing user id in usersLikes or userDislikes array
    // Decremanting likes or dislikes by one
    else {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                    )
                        .then((sauce) => {
                            res.status(200).json({ message: "Like enlevé !" });
                        })
                        .catch((error) => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(userId)) {
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
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};

