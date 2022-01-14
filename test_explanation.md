# Présentation Des Tests
   <p align="center">
  <img src="https://github.com/MedalVerse/MedalVerse-Front/blob/main/data/test.svg" />
</p>

   
|NOM DE FICHIER|DESCRIPTION|
|:---|:---|
|DAPP-Test.js|Fonctionnalités internes de la DAPP, gère la base de données|
|Medal-Test.js|Token ERC20: la monnaie $MDL de medalVerse|
|NFTArtist-Test.js|test du contrat contenant les oeuvres proposées par les artistes|
|ThrowIn-Test.js|Tet du contrat représentant le trophée Coupe Du Monde|
   
   
## Outils Utilisés
   
   
**Mocha,Chai**
*Utilisé pour l'ensemble des tests.
Nous partons avec un état vierge à chaque test, donc définition d'un beforEach faisant les initialisations nécessaires"

**chai-bignumber**
*Utilisé spécifiquement, la lib BN générant des incompatibilités avec Heroku*

**catchException(Promise, errType)**  /script/catchException.js
*Utilisé pour tester qu'une exception a bien été levée. Permet de tester la bonne implémentation de modifiers / assert /require*


## Code Coverage:

MedalVerse expose la majorité des fonctionnalités disponibles, seules quelques fonctions provenant des classes (AuthorHandler, EventHandler, MedalHandler, OrganizerHandler, SportsmanHandler, UserHandler) sont publiques et utilisables par un autre utilisateur que Owner
Les tests suivent le schéma de la User Story et ne couvrent pas les fonctionnalités hors de ce contexte  (suppression de sportifs / événements / organisateurs / Admin, n'est pas utilisé)


## Structures Internes:
   
### Tests de medalVerse
   
Cas de bon Fonctionnement
  * **ZC**-*Vérifie la possibilité de withdraw les tokens dans le contrat MedalVerse*
   
#### contrat UserHandler:
   
Cas de bon Fonctionnement
  * **A**-*Enregistrer un utilisateur dans la base et vérifier le stockage des paramètres*
  * **C**-*Créer un User de type sportif, et vérifier qu'un SportsMan a été créé*
  * ***D**-*Creer un User de type organisateur, vérifier qu'un Organizer est créé*
  * **E**-*Creer un User de type auteur, vérifier qu'un Author est créé*
   
Gestion d'erreurs
  * **B**-*Vérifier qu'un utilisateur autre que owner ne peut pas enregistrer de User*
  * **F**-*Vérifier qu'une exception est générée lorsque l'on lit en dehors de la plage des sportifs créés*
  * **G**-*Vérifier qu'une exception est générée lorsque l'on lit en dehors de la plage des organizers créés*
  * **H**-*Vérifier qu'un user non auteur retourne un auteur vide*
   
#### Contrat AuthorHandler:
   
Cas de bon Fonctionnement
  * **I**-*Ajouter une création à un auteur, vérifier la bonne écriture dans la base*
  * **J**-*Vérifier qu'un création a bien un lien avec son auteur*
  * **K**-*Affecte un descriptif de NFT à une création et vérifie le lien*
   
Gestion d'erreurs
  * **L**-*Vérifier une exception si ajout d'une création à un utilisateur non auteur*
  * **M**-*Accéder à la liste des créations d'un auteur non existant*
  * **N**-*Récupérer une liste de créations en dehors des ranges*
   
#### Contrat EventHandler:
   
Cas de bon Fonctionnement:
  * **O**-*Ajoute un événement sur une organization valide*
  * **P**-*Démarre un événement*
  * **Q**-*Arrete un événement*
  * **R**-*Définit un Winner à un événement*
  * **S**-*Ajoute une médaille à un événement*
  * **T**-*Publie une médaille*
  * **U**-*Ajoute un événement et vérifie l'écriture dans le contrat MedalVerse*
   
Gestion d'erreurs
  * **V**-*Ajouter un événement sur une organization invalide*
  * **W**-*Accèdér à un événement avec un id d'événement invalide*
  * **X**-*Démarrer/Terminer un événement non existant*
  * **Y**-*Démarrer/Terminer un événement dont on est pas admin*
  * **Z**-*Ajouter une médaille à sans déclarer de vainqueur*
  * **ZA**-*Ajouter une médaille sans être administrateur de l'event*
  * **ZB**-*Déclare un gagnant sans être administrateur de l'event*
  * **ZC**-*Withdraw les tokens placés dans le contrat*
  * **ZD**-*Withdraw les tokens placés dans le contrat lorsqu'il est vide*
     
   
### NFT
   
Tests des NFTs
   
#### contrat ThrowIn: 
   
Cas de bon Fonctionnement
  * **A**-*Mint d'un NFTArtist , Mint d'un NFTCup avec l'uri du NFTArtist et vérification de la balance et URI stockée*
  * **B**-*Ajoute uu gagnant et vérifie le stockage des paramètres*
  * **C**-*Mint d'un NFTArtist, Mint d'un NFTCup, vérifie la balance du owner, envoi du NFTArtist à un user, vérifie la balance du owner, set pause au contract, verifie que l'état pause est effectif,*
    l'owner recupere le NFT à l'user, vérifie la balance de l'owner, remove pause du contrat et vérifie que pause est faux*
  * **I**-*Ajoute l'année de la compétition, ajoute 3 gagnants et vérifie le stockage *
   
   
Gestion d'erreurs
  * **D**-*Vérifier qu'il n'est pas possible de mint plusieurs NFTCup*
  * **E**-*Vérifier qu'il n'est pas possible d'utiliser transferFromWithoutPermission sans etre l'owner*
  * **F**-*Vérifier qu'il n'est pas possible de mettre le contrat en pause si on n'est pas l'owner*
  * **G**-*Vérifier qu'il n'est pas possible d'utiliser une fonction qui neccesite que le contrat soit en pause quand le contrat n'est pas en pause*
  * **H**-*Vérifier qu'il n'est pas possible d'utiliser une fonction qui neccesite que le contrat ne soit pas en pause quand le contrat est en pause*
  * **J**-*Vérifier qu'il n'est pas possible d'utiliser une fonction qui neccesite l'antiDopage quand il est desactivé*
   
#### contrat NFTArtist:
   
Cas de bon Fonctionnement
  * **A**-*Mint un NFTArtist, vérifie la balance de l'user ainsi que la structure du NFT*
  * **B**-*Change le prix de Mint*
  * **C**-*Change l'address du contrat MedalVerse*
   
   
   
## Token
   
   
###contrat Medal:
   
Cas de bon Fonctionnement
  * **A**-*Verifie que la supply est bonne et dans le bon wallet*
  * **B**-*Verification de la fonction burn*
   
Gestion d'erreurs
  * **C**-*Verification qu'il est impossible de burn un montant depassant le montant max à burn*
  * **D**-*Verification qu'il est impossible de burn si on n'est pas l'owner*
 
