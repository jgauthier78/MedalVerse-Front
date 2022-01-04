// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThrowIn is ERC721, Ownable {
	IERC721Metadata NFT_Medal; // Recovering an ERC721 interface

	constructor(
		string memory organization,
		address addressNFT_Medal,
		string memory name,
		string memory symbol
	) ERC721(name, symbol) {
		IERC721Metadata(addressNFT_Medal).supportsInterface(type(IERC721).interfaceId);
		NFT_Medal = IERC721Metadata(addressNFT_Medal);
		nameOfOrganization = organization;
		name = name;
		symbol = symbol;
	}

	//@dev Structure to describe the winner
	struct Winner {
		string playerName; // Name of winner 
		uint256[] year; // All the years of victory
		uint256 numberOfVictory; // Number of victory of player or team
	}


	// Data --------------------------------
	Winner[] public winnersArray; // Winner structure array
	uint16[] public yearOfParticipationArray; // Stock up on the years where the competition takes place

	mapping(address => Winner) public winnerMap; // Associate a winner structure with an address
	mapping(uint256 => string) public uriToken; // Associate the token id and the uri
	mapping(uint16 => address) public winnerByYearMap; // Year -> Winners array

	string nameOfOrganization;
	string uri;
	uint256 numberMint;
	uint16 year;
	bool pause;

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0), "Zero address");
		_;
	}

	///@dev Check that the contract is paused
	modifier whenPaused() {
		require(pause == true, "Pausable: not paused");
		_;
	}

	///@dev Check that the contract is not paused
	modifier whenNotPaused() {
		require(pause == false, "Pausable: paused");
		_;
	}

	// Events ---------------------------------
	event throwInCupMinted(address mint);
	event throwInWinnersAdd(address organizer, address winners);
	event throwInSetPause(bool check);
	event throwInPauseRemoved(bool check);
	event throwInTranserWithoutPermission(address caller, address recipient, uint id);
	event throwInSetYear(uint whatYear);


	// Methods -------------------------------
	///@dev Mint the only possible edition of the NFT Cup
	///@param tokenId Token id of the NFTA Artist got the Uri
	function mintCup(uint256 tokenId)
		public
		onlyOwner
		whenNotPaused
	{
		require(numberMint == 0, "Only one single cup can be minted"); // Check if the nft has already been minted

		uri = IERC721Metadata(NFT_Medal).tokenURI(tokenId); // Get the uri of the NFTArtist

		numberMint++; // increment the number of NFT mint

		uriToken[numberMint] = uri; // Set the uri of the mint token

		_mint(msg.sender, numberMint); // Mint the NFT

		emit throwInCupMinted(msg.sender);
	}

	///@dev Ensures that only the owner can move the nft when the contract is paused
	///@param from NFT owner address
	///@param to address receiving the NFT
	///@param tokenId Token ID to transfer
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal override {
		address ownerContract = owner();

		if (ownerContract != msg.sender) {
			revert("contract is paused:Only the owner can transfer token");
		}

		super._beforeTokenTransfer(from, to, tokenId);
	}

	///@dev Recovery of NFT without the athlete's consent
	///@param from NFT owner address
	///@param tokenId ID to transfer
	function safeTransferFromWithoutPermission(address from, uint256 tokenId)
		public
		onlyOwner
		whenPaused
	{
		_safeTransfer(from, msg.sender, tokenId, "");

		emit throwInTranserWithoutPermission(msg.sender, from, tokenId);
	}

	///@dev pause the contract
	function setPaused() public onlyOwner whenNotPaused {
		pause = true;

		emit throwInSetPause(pause);
	}

	///@dev unpause the contract
	function removePaused() public onlyOwner whenPaused {
		pause = false;

		emit throwInPauseRemoved(pause);
	}


	function setYear(uint16 competYear) public onlyOwner whenNotPaused {

		year = competYear;
		yearOfParticipationArray.push(year);

	}

	///@dev Add winners to the Winners array and modify its structure associated with this wallet
	///@param walletPlayer winner's address
	function addWinner(
		string memory name,
		address walletPlayer
		)
		public
		onlyOwner
		isNotNull(walletPlayer)
		whenNotPaused
	{
		require(year != 0, "Define a year");
		
		// Define the winner structure
		winnerMap[walletPlayer].playerName = name;
		winnerMap[walletPlayer].year.push(year);
		winnerMap[walletPlayer].numberOfVictory += 1;

		winnersArray.push(
			Winner(
				winnerMap[walletPlayer].playerName,
				winnerMap[walletPlayer].year,
				winnerMap[walletPlayer].numberOfVictory
			)
		); // Push the structure into the winner array

		emit throwInWinnersAdd(msg.sender, walletPlayer);
	}



	// Methods View-------------------------------

	///@return Return all winners by name and assigned number
	function getAllWinners()
		public
		view
		returns (string[] memory, uint256[] memory)
	{
		string[] memory winnersString = new string[](winnersArray.length); // Instantiate a string array the length of the winners array
		uint256[] memory yearsOfVictory = new uint256[](
			yearOfParticipationArray.length
		); // Instantiate a uint array the length of the yearOfParticipationArray

		// Loop that goes through all the name of the winner and copies it as well as the production years of the competition
		for (uint256 i = 0; i < winnersArray.length; i++) {
			winnersString[i] = winnersArray[i].playerName;
			yearsOfVictory[i] = yearOfParticipationArray[i];
		}

		return (winnersString, yearsOfVictory);
	}

	///@return Return the structure of the winner as well as the table of years
	function viewAllYearVictoryByAddress(address winner)
		public
		view
		isNotNull(winner)
		returns (uint256[] memory)
	{
		return (winnerMap[winner].year);
	}

	///@return returns a chosen year without the victorious years table
	///@param winner Address of a winner register
	///@param number Number selected from the list
	function viewThisVictoryByAddress(address winner, uint256 number)
		public
		view
		isNotNull(winner)
		returns (uint256)
	{
		return (winnerMap[winner].year[number]);
	}

	///@return Returns if the contract is paused or not
	function paused() public view returns (bool) {
		return pause;
	}

	///@dev Get the org who created the NFT
	///@return return the organization name
	function getOrganizationName() external view returns (string memory) {
		return nameOfOrganization;
	}

	function getYearOfCompetition() public view returns (uint16) {
		return year;
	}
}
