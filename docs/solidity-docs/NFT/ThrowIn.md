## `ThrowIn`





### `isNotNull(address a)`



Check that the address is not zero

### `whenPaused()`



Check that the contract is paused

### `whenNotPaused()`



Check that the contract is not paused

### `checkAntiDoping()`






### `constructor(string organization, address addressNFT_Artist, address addressToken, address addressMedalVerse, string name, string symbol, bool _antiDoping)` (public)





### `mintCup(uint256 tokenId)` (external)



Mint the only possible edition of the NFT Cup


### `_beforeTokenTransfer(address from, address to, uint256 tokenId)` (internal)



Ensures that only the owner can move the nft when the contract is paused


### `safeTransferFromWithoutPermission(address from, uint256 tokenId)` (external)



Recovery of NFT without the athlete's consent


### `organisazionRecovery(address from, uint256 tokenId)` (external)



Recover the NFT to restart the competition


### `setPaused()` (external)



pause the contract

### `removePaused()` (external)



unpause the contract

### `setYear(uint256 competYear)` (external)



Set the year of the compet


### `addWinner(string name, address walletPlayer)` (external)



Add winners to the Winners array and modify its structure associated with this wallet


### `getAllWinners() → string[], uint256[]` (external)





### `viewAllYearVictoryByAddress(address winner) → uint256[]` (external)





### `viewThisVictoryByAddress(address winner, uint256 number) → uint256` (external)





### `paused() → bool` (external)





### `getOrganizationName() → string` (external)



Get the org who created the NFT


### `getYearOfCompetition() → uint256` (public)






### `throwInCupMinted(address mint)`





### `throwInWinnersAdd(address organizer, address winners)`





### `throwInSetPause(bool check)`





### `throwInPauseRemoved(bool check)`





### `throwInTranserWithoutPermission(address caller, address recipient, uint256 id)`





### `throwInSetYear(uint256 whatYear)`





### `throwInOwnerRecovery(address caller, address recipient, uint256 id)`






### `Winner`


string playerName


uint256[] year


uint256 numberOfVictory



