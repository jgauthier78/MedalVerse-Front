// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMedaille is ERC721, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;
	
	mapping(uint=>string) public URIToken;
	
	string imageURI; // Store the path to find the image of the nft

	constructor(
		string memory name,
		string memory symbol,
		string memory imgURI
	) ERC721(name, symbol) {
		name = name; // Name of NFT
		symbol = symbol; // Symbol of NFT
		imageURI = imgURI; // Path for found the image of the nft
	}

	

	//@dev Mint the selected number of NFT Medaille
	//@param numberMint number to mint
	function mintNFTMedaille(uint256 numberMint) public onlyOwner {
		for (uint256 i; i < numberMint; i++) {
			_tokenIds.increment();
			uint256 newItemId = _tokenIds.current();
			_mint(msg.sender, newItemId);
			_setTokenURI(newItemId, imageURI);
		}
	}
}
