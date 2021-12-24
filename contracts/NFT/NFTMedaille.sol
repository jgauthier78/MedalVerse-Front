// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
 
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

 
contract NFTMedaille is ERC721URIStorage, Ownable {
 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor(string memory name, string memory symbol, string memory imgURI) ERC721 (name, symbol) {

       name = name; // Name of NFT
       symbol = symbol; // Symbol of NFT 
       imageURI = imgURI; // Path poru found the image of the nft
    }
   
    string imageURI; // Store the path to find the image of the nft
    
    //@dev Mint the selected number of NFT Medaille
    //@param numberMint number to mint
    function mintNFTMedaille (uint numberMint) public onlyOwner { 
    
       for(uint i; i < numberMint; i++){
       _tokenIds.increment();
       uint256 newItemId = _tokenIds.current();
       _mint(msg.sender, newItemId);
       _setTokenURI(newItemId, imageURI);
       }
 
    }

}