# MedalVerse
## _Description courte/sous-titre_

[![N|Solid](https://alyra.fr/wp-content/uploads/2019/06/logo-titre-alyra-bleu-transparent-64px_v3.png)](https://alyra.fr/)

Description longue du **projet**.

### Fonctionnalités :
- 1
- 2
- 3

Technos. utlisées :
 - Solidity 0.8
 - React 17 / Bootstrap 5 (5.1.3)
  - react-i18next

**Contrats Solidity :** 

 - Contrat 1
   description contrat 1
 - Contrat 2
   description contrat 2
 - ...
   ...
 - Contrat n
   description contrat n
 
**Interfaces Solidity :** 
- Interface 1
- Interface 2
- ...
- Interface n

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


[Déploiement Dev](https://medalverse-app-dev.herokuapp.com/)
https://medalverse-app-dev.herokuapp.com/

Chaine : Kovan ?
https://kovan.etherscan.io/
Adresses :

## Matic

# Testnet
 - Setting up Matic Mumbai Testnet :
https://medium.com/@pinkmoonfinance/how-to-use-pinksale-matic-testnet-8788e6a09e10

 - Créer un Id projet pour le RPC :
  https://rpc.maticvigil.com/
 
 - Block Explorer :
 https://mumbai.polygonscan.com/

 - Faucet :
https://faucet.polygon.technology/


truffle migrate --network maticMumbaiTestnet --reset


------------
[Editor.md Open source online Markdown editor.](https://pandao.github.io/editor.md "editor.md")
