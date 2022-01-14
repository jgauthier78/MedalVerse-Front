
Nous détaillons ici la revue de sécurité effectuée sur les contrats MedalVerse et ThrowIn
Le document est mis à jour régulièrement en fonction de l'évolution des contrats

MedalVerse.sol

Ré-entrance:
-----------
MedalVerse n'effectue pas de transfert, encapsule les NFT dans une structure, mais n'appelle pas de fonction sur ces derniers. 

- Il n'existe qu'un contrat MedalVerse
- Le contrat hérite de tous les contrats avec lesquels il intéragit, pas de possibilité de fournir un contrat modifié
- Pas de call, de send, de transfer, 

Pas de ré-entrance


OverFlow: 
---------
Variables sensibles: 
- Dates d'événement soumises à medalVerse - ajout de check pour vérifier qu'elles sont cohérentes, mais pas de manipulation de ces dernieres en solidity (uniquement en JS) donc non impactées par une attaque. 

- Toutes les données de référence (identifiant dans la base) sont checkées pour être dans les bonnes ranges de tableaux/map, on vérifie qu'elles ne générerent pas d'erreur ou d'échec innatendu via modifier & require

pas d'utilisation de librairie, pas de send.

Unexpected Ether: 
----------------
MedalVerse n'est pas payable, mais prend des NFT en paramètres qui eux peuvent déjà être mintés.
Le transfert vers MedalVerse ne peut etre gerer que par la fonction mint des nfts 
La fonction withdraw est utilisable seulement par l'owner


Visibilité:
-----------
MedalVerse est très sensible à la visibilté, en effet:

- Chaque contrat (Organizer,event,medal..) gère son métier de façon unilatérale, MedalVerse gère la synchronisation des différentes contrats en en assurant la bonne intégrité. Si une fonction des contrats Handler pouvait être appelée indépendemment des autres Handler, la base pourrait être rendue inutilisable.

Aussi on définit les règles suivantes:
**************************************
Pour les contrats handlers :
- Toutes les fonctions view peuvent-être publiques
- Toutes les fonctions nécessitant une intéraction ou ayant une dépendance avec un autre Handler sont en internal et une fonction de Medalverse gère la synchronisation.
- Tous les setters qui ont un role de fonction interne à la DAPP sont en owner

Pour le contrat MedalVerse:
- Les fonctions ne correspondant pas à des fonctionnalités utilisateurs (mais nécessaires aux fonctionnement de la DAPP) sont en onlyOwner


Référence à un contrat externe:
-------------------------------

- les deux contrats NFT et ThrowIn sont encapsulés dans les structures, mais aucun appel n'est effectué sur ces derniers, ils sont transmis au JS.
- Throwin est minté indépendamment de MedalVerse, et le contrat affecte le NFT via:

MedalVerse.sol : adminAddMedal(uint256 eventID, address _nft)

-> on vérifie la bonne implémentation de l'interface
IERC721(_nft).supportsInterface(type(IERC721).interfaceId);


Envoyer une adresse incomplete: 
-------------------------------

msg.sender est utilisé pour les enregistrements d'utilisateurs et les addresses sont checkées


Success de call:
----------------

Pas de Call dans les classes


Timestamp:
----------

Les dates utilisées sont en universal time, et gérée par le front. Pas d'interaction avec le contrat.
Pas d'utilisation du nombre de block, ou de délais dans le contrat.

tx.origin:
----------
Pas d'exploitation de "tx"


..........................................................
..........................................................



Contrat ThrowIn.sol


Ré-entrance:
------------

ThrowIn n'effectue pas de transfert, encapsule le NFT, appelle une seul fonction (view) de ce dernier.
Le contrat NFTAutheur est passé en paramètre, si ce dernier est lui-même un throwin, ou fait appel à ThrowIn, il échoue au mint et donc ne peut ensuite être transféré. Pas de prise de possession non souhaitée d'un 

Pas de ré-entrance potentielle


OverFlow: 
---------

ThrowIn n'est pas affecté par l'attaque d'overflow car:
Seule une incrementation présentante un overflow potentiel est effectué dans la fonction mint. L'appel est limité à une seule occurence (par modifier), il ne peut y avoir d'overflow


Unexpected Ether: 
----------------

ThrowIn gere le transfer du token seul dans ça fonction mint ne peut pas etre exploité pas un contrat malveillant


Visibilité:
-----------

La majorité des des fonctions  "public" sont des getters, les autres sont en onlyowner, réservées au propriétaire de la médaille.

Seules les fonctions view ont la possibilité d'etre utilisées par tous


Référence à un contrat externe:
-------------------------------

- le contrat $Medal est utilise dans throwIn seulement dans la fonction mint qui ne permais pas d'attaque 
- le contrat MedalVerse n'est pas utilisé dans throwIn nous gardons l'addresse pour l'envoie de token et non pour une interaction
- le contrat NFTArtist et encapsulés dans la structure, un seul appelle est effectuer sur celui ci mais c'est une fonction view
- NFTArtist est minté indépendamment de ThrowIn, et le contrat affecte le NFT via:

ThrowIn.sol : IERC721Metadata NFT_Medal;

-> on vérifie la bonne implémentation de l'interface dans le constructor
IERC721(addressNFT_Medal).supportsInterface(type(IERC721).interfaceId);


Envoyer une adresse incomplete: 
-------------------------------

msg.sender est utilisé pour les enregistrements d'utilisateur et les addresses sont checkées


Success de call:
----------------

Pas de Call dans les classes


Timestamp:
----------

Les dates utilisées sont en universal time, et gérées par le front. Pas d'interaction avec le contrat.


tx.origin:
----------
Pas d'exploitation de "tx"


Contrat NFTArtist


Ré-entrance:
------------

NFTArtist n'existe qu'en un seul exemplaire une fois déployé il est impossible de changé c'est contrat en parametre pour appellé un contrat malveillant 
Pas de ré-entrance potentielle


OverFlow: 
---------

NFTArtist n'est pas affecté par l'attaque d'overflow car:
Seule une incrementation présentante un overflow potentiel est effectué dans la fonction mint. L'incrementation se passe de 1 en 1 au fur est a mesure que les NFT sont mint.
OverFlow potentiel mais tres tres long


Unexpected Ether: 
----------------

NFTArtist gere un transfert de token seul sans intervention de l'utilisateur ou de contrat exterieur ne peut donc pas etre exploité par un contrat malveillant 


Visibilité:
-----------

La majorité des des fonctions  "public" sont des getters, les autres sont en onlyowner, réservées au propriétaire du contrat.

Seules les fonctions view ont la possibilité d'etre utilisées par tous


Référence à un contrat externe:
-------------------------------

- le contrat $Medal est utilise dans throwIn seulement dans la fonction mint qui ne permais pas d'attaque 
- le contrat MedalVerse n'est pas utilisé dans NFTArtist nous gardons l'addresse pour l'envoie de token et non pour une interaction
- Nous ajoutons les addresses dans le constructor une fois deployer les contrat externe ne pourront pas etre changer


Envoyer une adresse incomplete: 
-------------------------------

msg.sender est utilisé pour les enregistrements d'utilisateur et les addresses sont checkées


Success de call:
----------------

Pas de Call dans les classes


Timestamp:
----------

Les dates utilisées sont en universal time, et gérées par le front. Pas d'interaction avec le contrat.


tx.origin:
----------
Pas d'exploitation de "tx"



..........................................................
..........................................................



Contrat $Medal.sol


Ré-entrance:
------------

Pas de ré-entrance potentielle


OverFlow: 
---------

Les incrementation ne sont pas gérée par l'utilisateur
aucun risque d'overflow 


Unexpected Ether: 
----------------

La supply n'est pas integret au contrat ne peut donc pas etre vidé par un contrat malveillant


Visibilité:
-----------

La majorité des fonctions  "public" sont des getters, les autres sont en onlyowner, réservées au propriétaire du token.

Seules les fonctions view ont la possibilité d'etre utilisées par tous


Référence à un contrat externe:
-------------------------------

Ne fais de référence à aucun contrat externe 


Envoyer une adresse incomplete: 
-------------------------------

msg.sender est utilisé pour les enregistrements d'utilisateur et les addresses sont checkées


Success de call:
----------------

Pas de Call dans les classes


Timestamp:
----------

Les dates utilisées sont en universal time, et gérées par le front. Pas d'interaction avec le contrat.


tx.origin:
----------
Pas d'exploitation de "tx"
