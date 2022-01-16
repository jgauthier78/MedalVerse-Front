# Design Patterns

Liste des design patterns utilisé par MedalVerse:
<br/>
<br/>
## Guard Check

Les fonctions utilisent toutes des modifiers pour gérer sécurité d'accès, la bonne intégrité des paramètres au regard de l'algo est assuré par **require** et le bon état des variables ou résultat est validé par **assert**
Un code d'erreur est utilisé par require afin de limiter l'espace de stockage et les couts d'une chaine de caractère complète. 
En utilisant une chaine courte, require optimise en stockant sur un **uint32**

Ex:<br/>
```require(winner != address(0), "ERR_I");```

Error_Code.md contient la correspondance entre le code d'erreur et la chaine complète.
<br/>
<br/>
## State Machine

Le contrat Event permet de gérer les événements sportifs, il est dans différents états (démarré, en cours, terminé, en remise de médaille)

Ex:
```
enum stateOfCompetition {
	RegistrationOfParticipants,
	CompetitionInProgress,
	RewardDistribution,
	RewardDistributed
}

// Modifiers ----------------------------
modifier eventIsInState(uint256 eventId, stateOfCompetition _state) {
	require(eventList[eventId - 1].eventState == _state, "ERR_3");
	_;
}
```
<br/>
<br/>

## Access Restriction
<br/>
Nous limitons les appels aux fonctions afin de s'assurer que ces dernieres ne soiennt appelées que par le bon utilisateur et dans des conditions d'utilisations particulières

Ex:
```
    onlyOwner
    checkAntiDoping
    whenPaused
    notMinted
    ...
 ```
<br/>
<br/>
 
 ## Emergency Stop
<br/>
 Le contrat ThrowIn peut être mis en pause au cas ou il y a soupson de dopage et toute transaction / mint sur le contrat est interdit. Nous avons donc mmis en place une variation d'Emergency Stop qui correspond à un arret temporaire
 <br/>
 <br/>
 
 ## Héritage Multiple en diamant
 
**Formation d’un diamant:**

Le contrat D hérite de B et C
B ET C héritent tous les deux de A

**Solution:**

l’ordre dans la définition de l’héritage multiple résout l’indétermination du chemin à suivre
<br/>
```
contract D is B,C
```
<br/>
Solidity retient l'ordre de spécification pour choisir la version de code dupliqué à retenir (ici l'implémentation de B sera retenue)
<br/>
<br/>
 
 ## Héritage Multiple et virtual
 
**Héritage d’une même fonction sur deux branches:**

- Le contrat B, C et D définissent une même fonction *addressNotNull*
- D doit définir un code unique à utiliser pour la fonction *addressNotNull*

**Solution:**

- Définir *addressNotNull* en virtual dans chaque classe
- dans D: définir la fonction et spécifier quelle classe est surdéfinie

**soit en Solidity:**
```modifier addressNotNull(address a) virtual override( A,B )```
<br/>
<br/>

## Accès à un tableau stocké dans un contrat

**Problématique:**

On stock une liste d’éléments dans un tableaux, et l’on souhaite retourner cette liste pour, par exemple, affichage dans une UI. La taille du tableau pouvant être arbitrairement grande, la lecture peut échouer

**Solution:** 

Pagination:

- La fonction d’accès prend deux paramètres starIndx et endIndx qui retournent une portion du tableau
- Il est possible de limiter l'interrogation du tableau à une taille limite en ajoutant un modifier du max delta

```
function getEventList(uint256 _start, uint256 _end) maxQuery(_end,_start)
```


