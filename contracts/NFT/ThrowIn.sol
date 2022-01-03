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
		// string playerName; // Winning player or team's name
		uint256[] year; // All the years of victory
		address wallet; // Address wallet player or team
		uint256 numberOfVictory; // Number of victory of player or team
	}

	//@dev Structure to describe the participant
	struct Participant {
		uint256 participantId; // The number in array of participants
		string playerName; // Name of player or team winner
		address wallet; // Address wallet player or team
	}

	// Data --------------------------------
	Winner[] internal winnersArray; // Winner structure array
	Participant[] public participantArray; // Participant structure array
	uint256[] public yearOfParticipationArray; // Stock up on the years where the competition takes place

	mapping(address => Winner) public winnerMap; // Associate a winner structure with an address
	mapping(address => Participant) public participantMap; // Associate a participant structure with an address
	mapping(uint256 => string) public uriToken; // Associate the token id and the uri

	string nameOfOrganization;
	string uri;
	uint256 numberMint;
	uint256 totalNumberOfParticipants;
	bool pause;

	statusOfCompetition public status = statusOfCompetition.RegistrationOfParticipants; // Set the initial status

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0), "Zero address");
		_;
	}

	///@dev Check that the status is correct
	modifier isGoodStatus(statusOfCompetition expectedStatus) {
		require(status == expectedStatus,"Invalid state");
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
        // NewCompetitionYear
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
			revert("Only the owner can send when the contract is paused");
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

	///@dev remove pause the contract
	function removePaused() public onlyOwner whenPaused {
		pause = false;
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
        require ( bytes(participantMap[walletPlayer].playerName).length == 0, "Participant already exist");
        // Check name length
        require( bytes(playerName).length > 0,  "Empty name");


		// Define the participant structure
		participantMap[walletPlayer].participantId = totalNumberOfParticipants;
		participantMap[walletPlayer].playerName = playerName;
		// participantMap[walletPlayer].wallet = walletPlayer;

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

    /*
	///@dev Browse the statuses to know in which status the contract and move on to the next one
	function changeStatusForNext() public onlyOwner whenNotPaused {
		statusOfCompetition previousStatus; // Save current status for display as previous status in event

		if (status == statusOfCompetition.RegistrationOfParticipants) {
			status = statusOfCompetition.CompetitionInProgress;
			previousStatus = statusOfCompetition.RegistrationOfParticipants;
		} else if (status == statusOfCompetition.CompetitionInProgress) {
			removeAllParticipants();
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
    */

    ///@dev Change status from RegistrationOfParticipants to CompetitionInProgress
    function changeStatusToCompetitionInProgress() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.RegistrationOfParticipants) {
        require(totalNumberOfParticipants>0, "No participant");
        status = statusOfCompetition.CompetitionInProgress;
		emit ThrowInStatueChange(statusOfCompetition.RegistrationOfParticipants, status);
    }

    ///@dev Change status from CompetitionInProgress to RewardDistribution
    function changeStatusToRewardDistribution() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.CompetitionInProgress) {
        status = statusOfCompetition.RewardDistribution;
		emit ThrowInStatueChange(statusOfCompetition.CompetitionInProgress, status);
    }

    ///@dev Change status from RewardDistribution to RewardExposed
    function changeStatusToRewardExposed() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.RewardExposed) {
        status = statusOfCompetition.RewardExposed;
		emit ThrowInStatueChange(statusOfCompetition.RewardExposed, status);
    }

    ///@dev Change status from RewardExposed to RecuperationReward
    function changeStatusToRecuperationReward() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.RewardExposed) {
        status = statusOfCompetition.RecuperationReward;
		emit ThrowInStatueChange(statusOfCompetition.RewardExposed, status);
    }
/*
    ///@dev Change status from RecuperationReward to NewCompetitionYear
    function changeStatusToNewCompetitionYear public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.RewardExposed) {
        status = statusOfCompetition.NewCompetitionYear
		emit ThrowInStatueChange(statusOfCompetition.RewardExposed, status);
    }
*/
    
    ///@dev Change status from x to RegistrationOfParticipants
    // function changeStatusToRegistrationOfParticipants() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.NewCompetitionYear) {
    function changeStatusToRegistrationOfParticipants() public onlyOwner whenNotPaused isGoodStatus(statusOfCompetition.RecuperationReward) {
        status = statusOfCompetition.RegistrationOfParticipants;
		emit ThrowInStatueChange(statusOfCompetition.RecuperationReward, status);
    }



	///@dev Add winners to the Winners array and modify its structure associated with this wallet
/*	// @param playerName winner's name */
	///@param walletPlayer winner's address
	///@param year Year of victory
	function addWinner(
		// string memory playerName,
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
		// winnerMap[walletPlayer].playerName = playerName;
		winnerMap[walletPlayer].numberOfVictory += 1;

		winnersArray.push(
			Winner(
				// playerName,
				winnerMap[walletPlayer].year,
				walletPlayer,
				winnerMap[walletPlayer].numberOfVictory
			)
		); // Push the structure into the winner array

		emit ThrowInWinnersAdd(msg.sender, walletPlayer);
	}

	///@dev Completely delete the participant array and reset the number of participants to 0
	function removeAllParticipants()
		internal
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionInProgress)
		whenNotPaused
	{
		uint256 len = participantArray.length; // retrieve array size

		for (uint256 i; i < len; i++) {
			// loop that traverses the array
			participantArray.pop(); // Remove all participant
        // TODO : Clear mappings
        //
		}


		totalNumberOfParticipants = 0; // Participant counter reset to 0

		emit ThrowInAllParticipantsRemoved();
	}

	///@dev Removes the targeted item from the Participants
	///@param element Number of participant remove
	function removeThisParticipant(uint256 element)
		public
		onlyOwner
		isGoodStatus(statusOfCompetition.CompetitionInProgress) // TOTO : Pourquoi seulement quand la compétition est commencée ? Si j'ajoute un participant lors de l'enregistrement je en peux pa sle retirer avant que la compétition ait commencé
		whenNotPaused
	{
		require(
			element < participantArray.length,
			"Your chosen element must be larger than the size of the array"
		); // Check that the participant number deleted smaller than the length of array
        // TODO : on ne peut pas supprimer le premier participant ?
		require(element > 0, "The chosen element must be greater than 0"); // Check that the deleted element is not below 0

		element--; // Remove 1 from the element to be removed to match the array

		// Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
		for (uint256 i = element; i < participantArray.length - 1; i++) {
			participantArray[i] = participantArray[i + 1];
			participantArray[i].participantId--; // Remove 1 from the number of lagged participants
		}

        // TODO : 
        // // Clear mapping
        // participantMap[participantWalletToRemove].participantId = 0; // Useless
        // participantMap[participantWalletToRemove].playerName = "";
        // // participantMap[participantWalletToRemove].wallet = address(0);

		totalNumberOfParticipants--; // Remove 1 from the number of participants
		element++; // Add 1 to retrieve the targeted element to have the correct number entered

		participantArray.pop();

		emit ThrowInThisParticipantRemoved(element);
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
            bytes(participantMap[participantWalletToRemove].playerName).length > 0,
			"Unknown participant"
		); // Check that the participant exist in map
        uint256 elementToRemove = participantMap[participantWalletToRemove].participantId;
        require(elementToRemove >= 0, "The chosen element must be greater or equal to 0"); // Check that the deleted element is not below 0

		// Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
        if (participantArray.length > 1)
        {
            for (uint256 i = elementToRemove; i < participantArray.length - 1; i++) {
                participantArray[i] = participantArray[i + 1];
                participantArray[i].participantId--; // Remove 1 from the participant id
            }
        }

        // Remove last item ; in case only one item exist, it set array size to 0
        participantArray.pop();

        // Clear mapping
        participantMap[participantWalletToRemove].participantId = 0; // Useless
        participantMap[participantWalletToRemove].playerName = "";
        // participantMap[participantWalletToRemove].wallet = address(0);

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
            winnersString[i] =  participantMap[ winnersArray[i].wallet ].playerName ;
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
	function viewtotalNumberOfParticipantss() public view returns (uint256) {
		return totalNumberOfParticipants;
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
