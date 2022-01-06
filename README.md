# MedalVerse
## _Description courte/sous-titre_

[![N|Solid](https://alyra.fr/wp-content/uploads/2019/06/logo-titre-alyra-bleu-transparent-64px_v3.png)](https://alyra.fr/)

Description longue du **projet**.

### Fonctionnalités :

Technos. utlisées :
 - Solidity 0.8
 - React 17 (17.0.2) / Bootstrap 5 (5.1.3)
 - react-i18next (21.3.3)

**Contrats Solidity :** 

 - Contrat NFT ThrowIn:
    Mint du NFT Roland Garros mintable en 1 seul exemplaire il est capable d'enregistrer et supprimée les participant a l'evenement et
    de garder dans un tableau les vainqueur present et passé 
 
 - MedalVerse: contrat principal qui expose les fonctionnalités de la DAPP, et possède les structures internes au fonctionnement de la DAPP. MedalVerse hérite des contrats Handler des structures internes.

 Structures internes: 
 
 - UserHandler : Un user est un utilisateur enregistré sur la plateforme, avec un ensemble de détails sur la personne détentrice du compte. UserHandler gère la liste des Users, accès, création, désactivation

 - AuthorHandler: un auteur est un user aynt des propriétés spécifiques qui possède une liste de créations, peut en produire de nouvelles et les vendre. AuthorHandler gère la liste des auteurs, des créations (accès à la base, appel de fonction sur ces structures).

- OrganizerHandler: Un organizer est un organisme qui peut créer des évènements, il est piloté par une liste d'admins qui ont le droit d'intéragir avec l'évènement. OrganizerHandler permet de lister, ajouter/désactiver un organizer

- EventHandler: Un évènement est généré par un organisme, et possède des propriétés particulières (date de départ, fin, etc.). EventHandler gère la liste des

- SportsmanHandler: Un Sportsman est un user ayant le rôle de Sportif et possède des propriétés supplémentaires comme une liste d'évènement auquel il est enregistré, ainsi qu'un champ de bits décrivant les sports qu'il pratique. SportsmanHandler gère la liste des Sportsman

- MedalHandler: Gère la liste des médailles basées sur ThrowIn

## Installation
- à la racine du projet :
npm i
- dans le répertoire client :
npm i

### Paramétrage
les variables d'environnement sont à mentre dans un fichier **.env** à la racine du projet

contenu du .env :
**Wallet_mnemonic**=
**InfuraProjectId**=
**Matic_MedalVerse_Dev_01_ProjectId**=
***InfuraProjectSecret***=[facultatif]
***Account00PK***=[facultatif] clé privée pour signer des transactions en batch

## Lancement :
- dans le répertoire client :
npm start*

utilise  le module cross-env pour lancer un navigateur spécifique : modifier package.json et supprimer cross-env et/ou remplacer le navigateur  dans la ligne :
**"start": "***cross-env BROWSER='brave' * **react-scripts start"**,


## Lancement des tests
- à la racine du projet :

truffle test --network developement

## Matic
[Déploiement Dev](https://medalverse-dev-maticmumbai.herokuapp.com/)
https://medalverse-dev-maticmumbai.herokuapp.com/

### Testnet
 - Setting up Matic Mumbai Testnet :
https://medium.com/@pinkmoonfinance/how-to-use-pinksale-matic-testnet-8788e6a09e10

 - Créer un Id projet pour le RPC :
  https://rpc.maticvigil.com/
 
 - Block Explorer :
 https://mumbai.polygonscan.com/

 - Faucet :
https://faucet.polygon.technology/



------------
[Editor.md Open source online Markdown editor.](https://pandao.github.io/editor.md "editor.md")
