// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThrowIn is ERC721, Ownable {
	IERC721Metadata NFT_Medal; // Recovering an ERC721 interface

	constructor(
		string memory oragnization,
		address addressNFT_Medal,
		string memory name,
		string memory symbol
	) ERC721(name, symbol) {
		NFT_Medal = IERC721Metadata(addressNFT_Medal);
		nameOfOrganization = oragnization;
		name = name;
		symbol = symbol;
	}

	//@dev Structure to describe the winner
	struct Winners {
		string player; // Name of player or team winner
		uint256[] year; // All the years of victory
		address wallet; // Address wallet player or team
		uint256 numberOfVictory; // Number of victory of player or team
	}

	//@dev Structure to describe the participant
	struct Participants {
		uint256 nbActiveParticipant; // The number in array of participants
		string player; // Name of player or team winner
		address wallet; // Address wallet player or team
	}

	// Data --------------------------------
	Winners[] internal winnersArray; // Winner structure array
	Participants[] public participantArray; // Participant structure array
	uint256[] public yearOfParticipationArray; // Stock up on the years where the competition takes place

	mapping(address => Winners) public winnerMap; // Associate a winner structure with an address
	mapping(address => Participants) public participantMap; // Associate a participant structure with an address
	mapping(uint256 => string) public uriToken; // Associate the token id and the uri

	string nameOfOrganization;
	string uri;
	uint256 numberMint;
	uint256 numberOfParticipant;
	bool pause;

	statusOfCompetition status = statusOfCompetition.RegistrationOfParticipants; // Set the status

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	///@dev Check that the status is correct
	modifier isGoodStatus(statusOfCompetition expectedStatus) {
		require(status == expectedStatus);
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
	event ThrowInCupMinted(address mint);
	event ThrowInParticipantAdd(address organizer, address participant);
	event ThrowInWinnersAdd(address organizer, address winners);
	event ThrowInAllParticipantsRemoved();
	event ThrowInThisParticipantRemoved(uint256 numberPlayerRemoved);
	event ThrowInStatueChange(
		statusOfCompetition previousStatus,
		statusOfCompetition newStatus
	);

	// Status ---------------------------------
	enum statusOfCompetition {
		RegistrationOfParticipants,
		CompetitionInProgress,
		RewardDistribution,
		RewardExposed,
		RecuperationReward
	}

	// Methods -------------------------------
	///@dev Mint the only possible edition of the NFT Cup
	///@param tokenId Token id of the NFTA Artist got the Uri
	function mintCup(uint256 tokenId)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
		whenNotPaused
	{
		require(numberMint == 0, "You could only mint 1 cup"); // Check if the nft has already been minted

		uri = IERC721Metadata(NFT_Medal).tokenURI(tokenId); // Get the uri of the NFTArtist

		numberMint++; // increment the number of NFT mint

		uriToken[numberMint] = uri; // Set the uri of the mint token

		_mint(msg.sender, numberMint); // Mint the NFT

		emit ThrowInCupMinted(msg.sender);
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
			revert("Only the owner can send when the contract is paused");
		}

		super._beforeTokenTransfer(from, to, tokenId);
	}

	///@dev Recovery of NFT without the athlete's consent
	///@param from NFT owner address
	///@param tokenId ID to transfer
	function safeTransferFromOnlyCheater(address from, uint256 tokenId)
		public
		onlyOwner
		whenPaused
	{
		_safeTransfer(from, msg.sender, tokenId, "");
	}

	///@dev pause the contract
	function setPaused() public onlyOwner whenNotPaused {
		pause = true;
	}

	///@dev remove pause the contract
	function removePaused() public onlyOwner whenPaused {
		pause = false;
	}

	///@dev Add participants to the Participant array and modify its structure associated with this wallet
	///@param player Name of player or team
	///@param walletPlayer adress of player or team
	function addParticipant(string memory player, address walletPlayer)
		public
		onlyOwner
		isNotNull(walletPlayer)
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
		whenNotPaused
	{
		numberOfParticipant++; // Increases the number of participants

		// Define the participant structure
		participantMap[walletPlayer].nbActiveParticipant = numberOfParticipant;
		participantMap[walletPlayer].player = player;
		participantMap[walletPlayer].wallet = walletPlayer;

		participantArray.push(
			Participants(
				participantMap[walletPlayer].nbActiveParticipant,
				player,
				walletPlayer
			)
		); // Push the structure into the participant array

		emit ThrowInParticipantAdd(msg.sender, walletPlayer);
	}

	///@dev Browse the statuses to know in which status the contract and move on to the next one
	function changeStatusForNext() public onlyOwner whenNotPaused {
		statusOfCompetition previousStatus; // Save current status for display as previous status in event

		if (status == statusOfCompetition.RegistrationOfParticipants) {
			status = statusOfCompetition.CompetitionInProgress;
			previousStatus = statusOfCompetition.RegistrationOfParticipants;
		} else if (status == statusOfCompetition.CompetitionInProgress) {
			status = statusOfCompetition.RewardDistribution;
			previousStatus = statusOfCompetition.CompetitionInProgress;
		} else if (status == statusOfCompetition.RewardDistribution) {
			status = statusOfCompetition.RewardExposed;
			previousStatus = statusOfCompetition.RewardDistribution;
		} else if (status == statusOfCompetition.RewardExposed) {
			status = statusOfCompetition.RecuperationReward;
			previousStatus = statusOfCompetition.RewardExposed;
		} else if (status == statusOfCompetition.RecuperationReward) {
			status = statusOfCompetition.RegistrationOfParticipants;
			previousStatus = statusOfCompetition.RecuperationReward;
		} else {
			revert("Unknow Status");
		}

		emit ThrowInStatueChange(previousStatus, status);
	}

	///@dev Add winners to the Winners array and modify its structure associated with this wallet
	///@param player name of winner
	///@param walletPlayer address of winner
	///@param year Year of victory
	function addWinner(
		string memory player,
		address walletPlayer,
		uint256 year
	)
		public
		onlyOwner
		isNotNull(walletPlayer)
		isGoodStatus(statusOfCompetition.RewardDistribution)
		whenNotPaused
	{
		yearOfParticipationArray.push(year); // Push the year of the competition into the array

		// Define the winner structure
		winnerMap[walletPlayer].year.push(year);
		winnerMap[walletPlayer].wallet = walletPlayer;
		winnerMap[walletPlayer].player = player;
		winnerMap[walletPlayer].numberOfVictory += 1;

		winnersArray.push(
			Winners(
				player,
				winnerMap[walletPlayer].year,
				walletPlayer,
				winnerMap[walletPlayer].numberOfVictory
			)
		); // Push the structure into the winner array

		emit ThrowInWinnersAdd(msg.sender, walletPlayer);
	}

	///@dev Completely delete the participant array and reset the number of participants to 0
	function removeAllParticipants()
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionInProgress)
		whenNotPaused
	{
		uint256 len = participantArray.length; // retrieve array size

		for (uint256 i; i < len; i++) {
			// loop that traverses the array
			participantArray.pop(); // Remove all participant
		}

		numberOfParticipant = 0; // Participant counter reset to 0

		emit ThrowInAllParticipantsRemoved();
	}

	///@dev Removes the targeted item from the Participants
	///@param element Number of participant remove
	function removeThisParticipant(uint256 element)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionInProgress)
		whenNotPaused
	{
		require(
			element < participantArray.length,
			"Your chosen element must be larger than the size of the array"
		); // Check that the participant number deleted smaller than the length of array
		require(element > 0, "The chosen element must be greater than 0"); // Check that the deleted element is not below 0

		element--; // Remove 1 from the element to be removed to match the array

		// Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
		for (uint256 i = element; i < participantArray.length - 1; i++) {
			participantArray[i] = participantArray[i + 1];
			participantArray[i].nbActiveParticipant--; // Remove 1 from the number of lagged participants
		}

		numberOfParticipant--; // Remove 1 from the number of participants
		element++; // Add 1 to retrieve the targeted element to have the correct number entered

		participantArray.pop();

		emit ThrowInThisParticipantRemoved(element);
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
			winnersString[i] = winnersArray[i].player;
			yearsOfVictory[i] = yearOfParticipationArray[i];
		}

		return (winnersString, yearsOfVictory);
	}

	///@return Return all participants by name and assigned number
	function getAllParticipant()
		public
		view
		returns (string[] memory, uint256[] memory)
	{
		string[] memory participantString = new string[](
			participantArray.length
		); // Instantiate a string array the length of the participant array
		uint256[] memory numberParticipant = new uint256[](
			participantArray.length
		); // Instantiate a uint array the length of the participating array

		// Loop that runs through all the names of the participant board and their numbers in the competition
		for (uint256 i = 0; i < participantArray.length; i++) {
			participantString[i] = participantArray[i].player;
			numberParticipant[i] = participantArray[i].nbActiveParticipant;
		}

		return (participantString, numberParticipant);
	}

	///@return The name of organization owner contract
	function getOrganizationOwner() public view returns (string memory) {
		return nameOfOrganization;
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

	///@return See the number of participants remaining
	function viewNumberOfParticipants() public view returns (uint256) {
		return numberOfParticipant;
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
}
