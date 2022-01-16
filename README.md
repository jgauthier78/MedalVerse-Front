<p align="center">
  <img src="https://github.com/MedalVerse/MedalVerse-Front/blob/main/data/medalverse.png" />
</p>


## Description Du Projet
</br>
<img align="right" src="https://github.com/MedalVerse/MedalVerse-Front/blob/main/data/Main.gif" /> 
</br>
</br>
<p text-align="justify"> Le projet *MedalVerse* propose la création de médailles sportives sous forme de NFT: de la création d'un profil, à la gestion des compétitions, des participations et remise des prix.</p>


[![N|Solid](https://alyra.fr/wp-content/uploads/2019/06/logo-titre-alyra-bleu-transparent-64px_v3.png)](https://alyra.fr/) Projet réalisé dans le cadre de la formation Blockchain Alyra
</br>
</br>
</br>
<br/>
## Fonctionnalités :
</br>

* Un utilisateur enregistré en sportif se loggue sur la plateforme et accède à ses événements en cours
* Il peut consulter ses médailles
* Il paramètre quelle médaille est visible par le grand public dans sa galerie
* Il visualise sa galerie et peut la partager avec d'autres

* Un utilisateur, admninistrateur d'une association sportive, se loggue et arrive sur sa page d'administration
* Il voit les comptétitions qu'il organise
* Il peut les démarrer/cloturer
* Il remet une médaille à un sportif

</br>
</br>

## Technologies Utilisées :
 * Solidity 0.8
 * React 17 (17.0.2) / Bootstrap 5 (5.1.3)
 * react-i18next (21.3.3) pour traduction
</br>
</br>

# Contrats Solidity :
<br/>
<br/>

### Contrats Principaux: 

|CONTRAT|DESCRIPTION|
|:---|:-----|
|Medal|ERC20 utilisable pour mint les NFTs et les frais de MedalVerse|
|NFTArtist|NFT servant d'illustration pour les trophés|
|ThrowIn| Trophée de type Coupe Du Monde, mintable en 1 seul exemplaire, cumulant les vainqueurs presents et passés|
|MedalVerse| contrat principal qui expose les fonctionnalités de la DAPP, possèdant les structures internes nécessaires au fonctionnement. MedalVerse hérite des contrats Handler des structures internes.|
<br/>

### Contrats Internes: 

|CONTRAT|DESCRIPTION|
|:---|:-----|
|UserHandler|Un User est un utilisateur enregistré sur la plateforme, avec un ensemble de détails sur la personne détentrice du compte. UserHandler gère la liste des Users, accès, création, désactivation|
|AuthorHandler|Un Auteur est un user aynt des propriétés spécifiques qui possède une liste de créations, peut en produire de nouvelles et les vendre. AuthorHandler gère la liste des auteurs, des créations (accès à la base, appel de fonction sur ses structures)|
|OrganizerHandler|Un Organizer est un organisme qui peut créer des évènements, il est piloté par une liste d'admins qui ont le droit d'intéragir avec l'évènement. OrganizerHandler permet de lister, ajouter/désactiver un organizer|
|EventHandler|Un évènement est généré par un organisme, et possède des propriétés particulières (date de départ, fin, etc.). EventHandler gère la liste des|
|SportsmanHandler|Un Sportsman est un user ayant le rôle de Sportif et possède des propriétés supplémentaires comme une liste d'évènement auquel il est enregistré. SportsmanHandler gère la liste des Sportsman| 
|MedalHandler|Gère la liste des médailles basées sur ThrowIn|

</br>
</br>

# Installation

- à la racine du projet :
```npm i```
- dans le répertoire client :
```npm i```

### Paramétrage
les variables d'environnement sont à mentre dans un fichier **.env** à la racine du projet

contenu du .env :
```
**Wallet_mnemonic**=
**InfuraProjectId**=
**Matic_MedalVerse_Dev_01_ProjectId**=
***InfuraProjectSecret***=[facultatif]
***Account00PK***=[facultatif] clé privée pour signer des transactions en batch
```
## Lancement :
- dans le répertoire client :
`npm start`

utilise  le module cross-env pour lancer un navigateur spécifique : modifier package.json et supprimer cross-env et/ou remplacer le navigateur  dans la ligne :
```"start": "cross-env BROWSER='brave' react-scripts start",```
</br>
</br>
## Documents Annexes
|DOCUMENT|FICHIER|
|---:|:---|
|design_patterns.md|[design_patterns.md](design_patterns.md)|
|Audit de sécurité|[avoiding_common_attacks.md](avoiding_common_attacks.md)|
|Optimisations utilisées|[Optimisations.md](Optimisations.md)
|Tests|[test_explanation.md](test_explanation.md)|
|Liste des codes d'erreur|[Error_Code.md](Error_Code.md)|
|Adresse de déploiement|[deployed_addresses.md](deployed_addresses.md)|
|Aide a l'installation|[INSTALL.MD](INSTALL.MD)|


</br>
</br>

## Lancement des tests
- à la racine du projet :

```truffle test --network developement```

## Matic
[Déploiement Dev](https://medalverse-dev-maticmumbai.herokuapp.com/)
https://medalverse-dev-maticmumbai.herokuapp.com/

### Testnet
 - Setting up Matic Mumbai Testnet :
```https://medium.com/@pinkmoonfinance/how-to-use-pinksale-matic-testnet-8788e6a09e10```

 - Créer un Id projet pour le RPC :
```  https://rpc.maticvigil.com/```
 
 - Block Explorer :
 ```https://mumbai.polygonscan.com/```

 - Faucet :
```https://faucet.polygon.technology/```


------------
[Editor.md Open source online Markdown editor.](https://pandao.github.io/editor.md "editor.md")
