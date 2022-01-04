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
		NFT_Medal = IERC721Metadata(addressNFT_Medal);
		nameOfOrganization = organization;
		name = name;
		symbol = symbol;
	}

	//@dev Structure to describe the winner
	struct Winner {
		uint256[] year; // All the years of victory
		uint256 numberOfVictory; // Number of victory of player or team
	}

	//@dev Structure to describe the participant
	struct Participant {
		uint256 participantId; // The number in array of participants
		string playerName; // Name of player or team winner
		address wallet; // Wallet of player or team winner
	}

	// Data --------------------------------
	Winner[] public winnersArray; // Winner structure array
	Participant[] public participantArray; // Participant structure array
	uint16[] public yearOfParticipationArray; // Stock up on the years where the competition takes place

	mapping(address => Winner) public winnerMap; // Associate a winner structure with an address
	mapping(address => Participant) public participantMap; // Associate a participant structure with an address
	mapping(uint256 => string) public uriToken; // Associate the token id and the uri
	mapping(uint16 => address) public winnerByYearMap; // Year -> Winners array

	string nameOfOrganization;
	string uri;
	uint256 numberMint;
	uint256 totalNumberOfParticipants;
	uint16 year;
	bool pause;

	statusOfCompetition public status =
		statusOfCompetition.CompetitionPreparation; // Set the initial status

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0), "Zero address");
		_;
	}

	///@dev Check that the status is correct
	modifier isGoodStatus(statusOfCompetition expectedStatus) {
		require(status == expectedStatus, "Invalid state");
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
		CompetitionPreparation,
		RegistrationOfParticipants,
		CompetitionInProgress,
		RewardDistribution
	}

	// Methods -------------------------------
	///@dev Mint the only possible edition of the NFT Cup
	///@param tokenId Token id of the NFTA Artist got the Uri
	function mintCup(uint256 tokenId)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionPreparation)
		whenNotPaused
	{
		require(numberMint == 0, "Only one single cup can be minted"); // Check if the nft has already been minted

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
	}

	///@dev pause the contract
	function setPaused() public onlyOwner whenNotPaused {
		pause = true;
	}

	///@dev unpause the contract
	function removePaused() public onlyOwner whenPaused {
		pause = false;
	}

	///@return Returns if the contract is paused or not
	function paused() public view returns (bool) {
		return pause;
	}

	function setYear(uint16 competYear)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionPreparation)
		whenNotPaused
	{
		year = competYear;
		yearOfParticipationArray.push(year);
	}

	///@dev Add participants to the Participant array and modify its structure associated with this wallet
	///@param playerName player or team's name
	///@param walletPlayer adress of player or team
	function addParticipant(string memory playerName, address walletPlayer)
		public
		onlyOwner
		isNotNull(walletPlayer)
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
		whenNotPaused
	{
		// Check if participant doesn't already exist
		require(
			bytes(participantMap[walletPlayer].playerName).length == 0,
			"Participant already exists"
		);
		// Check name length
		require(bytes(playerName).length > 0, "Empty name");

		// Define the participant structure
		participantMap[walletPlayer].participantId = totalNumberOfParticipants;
		participantMap[walletPlayer].playerName = playerName;
		participantMap[walletPlayer].wallet = walletPlayer;

		totalNumberOfParticipants++; // Increases the number of participants

		participantArray.push(
			Participant(
				participantMap[walletPlayer].participantId,
				playerName,
				walletPlayer
			)
		); // Push the structure into the participant array

		emit ThrowInParticipantAdd(msg.sender, walletPlayer);
	}

	///@dev Change status from RegistrationOfParticipants to CompetitionInProgress
	function changeStatusToCompetitionInProgress()
		public
		onlyOwner
		whenNotPaused
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
	{
		require(totalNumberOfParticipants > 0, "Error:No participant");
		status = statusOfCompetition.CompetitionInProgress;
		emit ThrowInStatueChange(
			statusOfCompetition.RegistrationOfParticipants,
			status
		);
	}

	///@dev Change status from CompetitionInProgress to RewardDistribution
	function changeStatusToRewardDistribution()
		public
		onlyOwner
		whenNotPaused
		isGoodStatus(statusOfCompetition.CompetitionInProgress)
	{
		status = statusOfCompetition.RewardDistribution;
		emit ThrowInStatueChange(
			statusOfCompetition.CompetitionInProgress,
			status
		);
	}

	///@dev Change status from RewardExposed to RecuperationReward
	function changeStatusToCompetitionPreparation()
		public
		onlyOwner
		whenNotPaused
		isGoodStatus(statusOfCompetition.RewardDistribution)
	{
		require(
			totalNumberOfParticipants == 0,
			"participant array must not be empty"
		);
		status = statusOfCompetition.CompetitionPreparation;
		year = 0;
		emit ThrowInStatueChange(
			statusOfCompetition.RewardDistribution,
			status
		);
	}

	///@dev Change status from x to RegistrationOfParticipants

	function changeStatusToRegistrationOfParticipants()
		public
		onlyOwner
		whenNotPaused
		isGoodStatus(statusOfCompetition.CompetitionPreparation)
	{
		require(year > 0);
		status = statusOfCompetition.RegistrationOfParticipants;
		emit ThrowInStatueChange(
			statusOfCompetition.CompetitionPreparation,
			status
		);
	}

	///@dev Add winners to the Winners array and modify its structure associated with this wallet
	///@param walletPlayer winner's address
	function addWinner(address walletPlayer)
		public
		onlyOwner
		isNotNull(walletPlayer)
		isGoodStatus(statusOfCompetition.RewardDistribution)
		whenNotPaused
	{
		// Define the winner structure
		winnerMap[walletPlayer].year.push(year);
		winnerMap[walletPlayer].numberOfVictory += 1;

		winnersArray.push(
			Winner(
				winnerMap[walletPlayer].year,
				winnerMap[walletPlayer].numberOfVictory
			)
		); // Push the structure into the winner array

		emit ThrowInWinnersAdd(msg.sender, walletPlayer);
	}

	///@dev Removes the targeted item from the Participants
	///@param participantIndx Number of participant remove
	function removeThisParticipant(uint8 participantIndx)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
		whenNotPaused
	{
		require(
			participantIndx < participantArray.length,
			"participant index out of range"
		); // Check that the participant number deleted smaller than the length of array
		require(participantIndx > 0, "invalid participant index"); // Check that the deleted element is not below 0

		participantIndx--; // Remove 1 from the element to be removed to match the array
		address wallet = participantArray[participantIndx].wallet;

		// Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
		for (
			uint256 i = participantIndx;
			i < participantArray.length - 1;
			i++
		) {
			participantArray[i] = participantArray[i + 1];
			participantArray[i].participantId--; // Remove 1 from the number of lagged participants
		}

		// Clear mapping
		participantMap[wallet].participantId = 0; // Useless
		participantMap[wallet].playerName = "";
		participantMap[wallet].wallet = address(0);

		totalNumberOfParticipants--; // Remove 1 from the number of participants
		participantIndx++; // Add 1 to retrieve the targeted element to have the correct number entered

		participantArray.pop();

		emit ThrowInThisParticipantRemoved(participantIndx);
	}

	///@dev Removes the Participant
	///@param  participantWalletToRemove address of participant remove
	function removeParticipant(address participantWalletToRemove)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
		whenNotPaused
	{
		require(
			bytes(participantMap[participantWalletToRemove].playerName).length >
				0,
			"Unknown participant"
		); // Check that the participant exist in map
		uint256 elementToRemove = participantMap[participantWalletToRemove]
			.participantId;
		require(
			elementToRemove >= 0,
			"The chosen element must be greater or equal to 0"
		); // Check that the deleted element is not below 0

		// Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
		if (participantArray.length > 1) {
			for (
				uint256 i = elementToRemove;
				i < participantArray.length - 1;
				i++
			) {
				participantArray[i] = participantArray[i + 1];
				participantArray[i].participantId--; // Remove 1 from the participant id
			}
		}

		// Remove last item ; in case only one item exist, it set array size to 0
		participantArray.pop();

		// Clear mapping
		participantMap[participantWalletToRemove].participantId = 0; // Useless
		participantMap[participantWalletToRemove].playerName = "";
		participantMap[participantWalletToRemove].wallet = address(0);

		totalNumberOfParticipants--; // Remove 1 from the number of participants

		emit ThrowInThisParticipantRemoved(elementToRemove);
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
			// winnersString[i] = winnersArray[i].playerName;
			winnersString[i] = participantMap[participantArray[i].wallet]
				.playerName;
			yearsOfVictory[i] = yearOfParticipationArray[i];
		}

		return (winnersString, yearsOfVictory);
	}

	///@return Return all participants by name and assigned number
	function getAllParticipants()
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
			participantString[i] = participantArray[i].playerName;
			numberParticipant[i] = participantArray[i].participantId;
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
	function viewTotalNumberOfParticipants() public view returns (uint256) {
		return totalNumberOfParticipants;
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
