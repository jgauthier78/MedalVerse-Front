// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFTArtist is ERC721URIStorage, ERC721Enumerable, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds; // Manage the incrementation of the tokenId
	IERC20 private Token; // Recovering an ERC20 interface

	constructor(address addressMedal, address addressMedalVerse)
		ERC721("MedalVerse", "MDV")
	{
		Token = IERC20(addressMedal);
		medalVerse = addressMedalVerse;
	}

	///@dev Structure to describe the NFT
	struct NFT {
		uint256 tokenId; // TokenID of NFT
		address creator; // Creator of NFT
		string imgPath; // Image path for nft
		string name; // Name of NFT
	}

	// Data --------------------------------
	mapping(uint256 => NFT) public NFTs;

	uint256 MDL_Mint_Royalties = 100 * (10**18);
	address medalVerse;

	// Events ---------------------------------
	event nftArtistMint(address owner, string name, uint256 tokenId);
	event nftArtistPriceChanged(uint256 newPrice);
	event nftArtistAddressMedalVerseChanged(address newAddress);

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	// Methods -------------------------------
	///@dev Mint NFTArtist
	///@param name Name of the structure NFT
	///@param Uri Path to Image
	function mintNFTArtist(string memory name, string memory Uri) public {
		uint256 balance = Token.balanceOf(msg.sender);
		require(balance > MDL_Mint_Royalties);

		Token.transferFrom(msg.sender, medalVerse, MDL_Mint_Royalties);

		_tokenIds.increment(); // Define the TokenId
		uint256 NFTArtistId = _tokenIds.current(); // Define the id of the NFTArtist in relation to this variable TokenIds
		_mint(msg.sender, NFTArtistId); // Mint the NFT
		_setTokenURI(NFTArtistId, Uri); // Set URI for this id

		NFTs[NFTArtistId].name = name;
		NFTs[NFTArtistId].tokenId = NFTArtistId;
		NFTs[NFTArtistId].creator = msg.sender;
		NFTs[NFTArtistId].imgPath = Uri;

		emit nftArtistMint(msg.sender, name, NFTArtistId);
	}

	///@dev Modifies the structure and the mapping after a transfer
	///@param from NFT owner address
	///@param to address receiving the NFT
	///@param tokenId Token ID to transfer
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal override(ERC721, ERC721Enumerable) isNotNull(to) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	///@dev delete the NFT with tokenId
	///@param tokenId tokenId nft deleted
	function _burn(uint256 tokenId)
		internal
		override(ERC721, ERC721URIStorage)
	{
		delete NFTs[tokenId];

		super._burn(tokenId);
	}

	///@return Returns the URI of the NFT associated with its ID
	///@param tokenId Token ID to view
	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC721Enumerable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}

	///@dev change price of NFT
	///@param newPrice NewPrice to be defined
	function changePrice(uint256 newPrice) public onlyOwner {
		MDL_Mint_Royalties = newPrice;

		emit nftArtistPriceChanged(newPrice);
	}

	///@dev Change address MedalVerse contract
	///@param addressMedalVerse new address of MedalVerse contract
	function setAddressMedalVerse(address addressMedalVerse) public onlyOwner {
		medalVerse = addressMedalVerse;

		emit nftArtistAddressMedalVerseChanged(addressMedalVerse);
	}

	// view ------------------------
	///@dev View price
	///@return price of nft
	function checkPrice() public view returns (uint256) {
		return MDL_Mint_Royalties;
	}

	///@dev view address to MedalVerse contract
	///@return Address MedalVerse contract
	function checkAddressMedalVerse() public view returns (address) {
		return medalVerse;
	}
}
