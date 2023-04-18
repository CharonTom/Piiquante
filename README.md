# Projet 6 : Piiquante

![Page login](https://github.com/CharonTom/Piiquante/blob/main/images/accueil.jpg)
![page main](https://github.com/CharonTom/Piiquante/blob/main/images/main.jpg)
![Page produit](https://github.com/CharonTom/Piiquante/blob/main/images/modif.jpg)

### Ceci est mon sixième projet de ma formation OpenClassRooms.

## J'ai construit une API sécurisée pour une application d'avis gastronomiques

Hot Takes est une application web d'avis critiques spécialisé dans les sauces. Le but était de construire une API REST sécurisée qui respecte les règles de l'OWASP. L'application permet aux utilisateurs de poster et modifier des sauces avec également une fonction like et dislike.


### Exigences de sécurité

● Le mot de passe de l'utilisateur doit être haché.

● L'authentification doit être renforcée sur toutes les routes sauce requises.

● Les adresses électroniques dans la base de données sont uniques et un

plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
les erreurs.

● La sécurité de la base de données MongoDB (à partir d'un service tel que
MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
machine d'un utilisateur.

● Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
de données.

● Les versions les plus récentes des logiciels sont utilisées avec des correctifs
de sécurité actualisés.

● Le contenu du dossier images ne doit pas être téléchargé sur GitHub.



### Technologies utilisées:

- Node.js
- Express
- Mongoose

### Base de données

- MongoDB Atlas

---

### Installation

Installer les dépendances dans chacuns des deux dossiers avec la commande npm install

Frontend :

Dans ce projet le frontend était fourni.

- Lancer le Front avec 'ng serve'
- Puis vous rendre sur http://localhost:4200/

Backend :

Dans le dossier back il faut :

- Créer un fichier .env (le compléter comme sur l'exemple de .env.example)
- Créer un dossier "images"
- Lancer le Back avec 'nodemon server'