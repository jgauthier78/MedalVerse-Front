// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTArtist is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	struct NFT {
		string name;
		uint tokenId;
		address creator;
		string imgPath;
	}

	// mapping(uint=>NFT) public NFTs;
    mapping(address=>mapping(uint=>NFT)) public NFTByOwner;

	constructor() ERC721("MedalVerse", "MDV") {
	}

	//@dev Mint the selected number of NFT Medaille
	//@param numberMint number to mint
	function mintNFTArtist(string memory name, string memory Uri) public onlyOwner {
		
			_tokenIds.increment();
			uint256 newNFTArtistId = _tokenIds.current();
			_mint(msg.sender, newNFTArtistId);
			_setTokenURI(newNFTArtistId, Uri);
			NFTByOwner[msg.sender][newNFTArtistId].name = name;
			NFTByOwner[msg.sender][newNFTArtistId].tokenId = newNFTArtistId;
			NFTByOwner[msg.sender][newNFTArtistId].creator = msg.sender;
			NFTByOwner[msg.sender][newNFTArtistId].imgPath = Uri;
			

		
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
        NFTByOwner[to][tokenId].name = NFTByOwner[from][tokenId].name;
        NFTByOwner[to][tokenId].tokenId = NFTByOwner[from][tokenId].tokenId;
        NFTByOwner[to][tokenId].creator =  NFTByOwner[from][tokenId].creator;
        NFTByOwner[to][tokenId].imgPath = NFTByOwner[from][tokenId].imgPath;

        delete  NFTByOwner[from][tokenId].name;
        delete  NFTByOwner[from][tokenId].tokenId;
        delete  NFTByOwner[from][tokenId].creator;
        delete  NFTByOwner[from][tokenId].imgPath;

        
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        
        delete  NFTByOwner[msg.sender][tokenId].name;
        delete  NFTByOwner[msg.sender][tokenId].tokenId;
        delete  NFTByOwner[msg.sender][tokenId].creator;
        delete  NFTByOwner[msg.sender][tokenId].imgPath;
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
