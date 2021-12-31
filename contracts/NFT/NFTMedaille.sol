// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMedaille is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	struct NFT {
		string name;
		uint tokenId;
		address creator;
		string imgPath;
	}

	mapping(uint=>NFT) public NFTs;

	constructor() ERC721("MedalVerse", "MDV") {
	}

	//@dev Mint the selected number of NFT Medaille
	//@param numberMint number to mint
	function mintNFTMedaille(string memory name, string memory Uri) public onlyOwner {
		
			_tokenIds.increment();
			uint256 newItemId = _tokenIds.current();
			_mint(msg.sender, newItemId);
			_setTokenURI(newItemId, Uri);
			NFTs[newItemId].name = name;
			NFTs[newItemId].tokenId = newItemId;
			NFTs[newItemId].creator = msg.sender;
			NFTs[newItemId].imgPath = Uri;
			

		
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

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

}
