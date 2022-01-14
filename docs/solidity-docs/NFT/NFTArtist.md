## `NFTArtist`





### `isNotNull(address a)`



Check that the address is not zero


### `constructor(address addressMedal, address addressMedalVerse)` (public)





### `mintNFTArtist(string name, string Uri)` (external)



Mint NFTArtist


### `_beforeTokenTransfer(address from, address to, uint256 tokenId)` (internal)



Modifies the structure and the mapping after a transfer


### `_burn(uint256 tokenId)` (internal)



delete the NFT with tokenId


### `tokenURI(uint256 tokenId) → string` (public)





### `supportsInterface(bytes4 interfaceId) → bool` (public)





### `changePrice(uint256 newPrice)` (external)



change price of NFT


### `setAddressMedalVerse(address addressMedalVerse)` (external)



Change address MedalVerse contract


### `checkPrice() → uint256` (external)



View price


### `checkAddressMedalVerse() → address` (external)



view address to MedalVerse contract



### `nftArtistMint(address owner, string name, uint256 tokenId)`





### `nftArtistPriceChanged(uint256 newPrice)`





### `nftArtistAddressMedalVerseChanged(address newAddress)`






### `NFT`


uint256 tokenId


address creator


string imgPath


string name



