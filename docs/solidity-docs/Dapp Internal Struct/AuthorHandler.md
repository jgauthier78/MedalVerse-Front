## `AuthorHandler`



Contract Adding / Removing Authors and their creations

### `isNotNull(address a)`





### `isNotNullUint256(uint256 a)`






### `addAuthor(address _user)` (internal)



Register an author, given an address


### `addCreation(address _user, uint256 _price, string _description, string _URI)` (external)



Register a creation for a given author


### `affectNFTtoCreation(uint256 _creationId, address _NFT)` (external)



Register a creation for a given author TESTED


### `getAuthorCreationsList(address _author) → uint256[]` (external)



returns the list of creations for user _author TESTED


### `getCreationList(uint256 _start, uint256 _end) → struct NFT_Medal_Bkg_Desc[]` (external)



returns the list of creations: they may be inactive, must test activ value TESTED


### `getAuthor(address _user) → struct Author` (external)



returns the Author struc corresponding to the user TESTED



### `AuthorAdded(address usrAddr, uint256 indx)`





### `CreationAdded(address usrAddr, uint256 indx)`







