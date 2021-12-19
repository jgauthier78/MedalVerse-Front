// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

struct NFT_Medal_Bkg_Desc {
	uint256 price; // Price for the corresponding NFT
	uint256 creationId; // Creation ref
	uint256 sportCategory;
	address author; // Owner of the NFT
	address NFT_Bkg_Adr; //Address for the minted NFT (can be null)
	string description; // Its Description
	string URI; // URI for the image
	bool activ; // Is It a valid struct ?
}
