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

    constructor() ERC721("MedalVerse", "MDV") {
	}

	struct NFT {
		string name; // Name of NFT
		uint tokenId; // TokenID of NFT
		address creator; // Creator of NFT
		string imgPath; // Image path for nft
	}

    // Data --------------------------------
	mapping(uint=>NFT) public NFTs;
    // mapping(address=>mapping(uint=>NFT)) public NFTByOwner; // Associate the owner address with the token id associated with the NFT structure

    // Events ---------------------------------
    event nftMint(address owner, string name, uint tokenId );

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
		
			_tokenIds.increment(); // Define the TokenId
			uint256 NFTArtistId = _tokenIds.current(); // Define the id of the NFTArtist in relation to this variable TokenIds
			_mint(msg.sender, NFTArtistId); // Mint the NFT 
			_setTokenURI(NFTArtistId, Uri); // Set URI for this id

            // Defined the structure of the NFT by are id associated with the owner address
			// NFTByOwner[msg.sender][NFTArtistId].name = name;
			// NFTByOwner[msg.sender][NFTArtistId].tokenId = NFTArtistId;
			// NFTByOwner[msg.sender][NFTArtistId].creator = msg.sender;
			// NFTByOwner[msg.sender][NFTArtistId].imgPath = Uri;
			NFTs[NFTArtistId].name = name;
            NFTs[NFTArtistId].tokenId = NFTArtistId;
            NFTs[NFTArtistId].creator = msg.sender;
            NFTs[NFTArtistId].imgPath = Uri;

            emit nftMint(msg.sender, name, NFTArtistId);
		
	}

    ///@dev Modifies the structure and the mapping after a transfer
    ///@param from NFT owner address
    ///@param to address receiving the NFT
    ///@param tokenId Token ID to transfer
	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable) isNotNull(to)
    {
        super._beforeTokenTransfer(from, to, tokenId);

        // Modify the mapping
        // NFTByOwner[to][tokenId].name = NFTByOwner[from][tokenId].name;
        // NFTByOwner[to][tokenId].tokenId = NFTByOwner[from][tokenId].tokenId;
        // NFTByOwner[to][tokenId].creator =  NFTByOwner[from][tokenId].creator;
        // NFTByOwner[to][tokenId].imgPath = NFTByOwner[from][tokenId].imgPath;

        // remove the old mapping
        // delete  NFTByOwner[from][tokenId].name;
        // delete  NFTByOwner[from][tokenId].tokenId;
        // delete  NFTByOwner[from][tokenId].creator;
        // delete  NFTByOwner[from][tokenId].imgPath;
        

        
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        
        // delete  NFTByOwner[msg.sender][tokenId].name;
        // delete  NFTByOwner[msg.sender][tokenId].tokenId;
        // delete  NFTByOwner[msg.sender][tokenId].creator;
        // delete  NFTByOwner[msg.sender][tokenId].imgPath;
        delete NFTs[tokenId].name;
        delete NFTs[tokenId].tokenId;
        delete NFTs[tokenId].creator;
        delete NFTs[tokenId].imgPath;
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

}
