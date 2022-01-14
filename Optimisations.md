Optimisation Structure de données
---------------------------------

Type de données:
----------------
uint8 consomme plus de gaz que uint256 si pas de packing possible, lors de l'utilisation.


Utilisation de MAP plutôt que de tableau
----------------------------------------
Les tableaux consomment plus que les map, privilégier les maps si pas besoin de parcours linéaire

Padding
-------
Pour éviter des couts sur les alignements: trie des structures par taille décroissante:

Memory/storage
--------------
Manipuler une variable memory et l'affecter ensuite au storage est moins couteux en gaz que d'utiliser une variable storage.

Require
--------
Nous retournons des codes d'erreu et non plus les chaines de caractère directement, pour éviter de stocker dans le contrat

external
--------
Permet de gagner sur la copie des parametres de fonction, de calldata a memory

