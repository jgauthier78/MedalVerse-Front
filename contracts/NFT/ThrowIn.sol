// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    contract ThrowIn is ERC721, Ownable {

        IERC721Metadata NFT_Medal; // Recovering an ERC721 interface
        
        constructor(string memory oragnization, address addressNFT_Medal, string memory name, string memory symbol) ERC721 (name, symbol){
        
        NFT_Medal = IERC721Metadata(addressNFT_Medal);
        nameOfOrganization = oragnization;
        name = name;
        symbol = symbol;
        }

        //@dev Structure to describe the winner
        struct Winners {
            string player; // Name of player or team winner
            uint[] year; // All the years of victory
            address wallet; // Address wallet player or team 
            uint numberOfVictory; // Number of victory of player or team 
        }

        //@dev Structure to describe the participant
        struct Participants {
            uint nbActiveParticipant; // The number in array of participants
            string player; // Name of player or team winner
            address wallet; // Address wallet player or team 
        }

        // Modifiers ----------------------------
	    modifier isNotNull(address a) virtual {
		    require(a != address(0));
		    _;
        }

        modifier isGoodStatus(statusOfCompetition expectedStatus){
            require(status == expectedStatus);
            _;
        }

        modifier whenPaused() {
            require(pause == true, "Pausable: not paused");
            _;
        }

        modifier whenNotPaused() {
            require(pause == false, "Pausable: paused");
            _;
        }

        // Data ---------------------------------
        //   Status 
        enum statusOfCompetition {
            RegistrationOfParticipants,
            CompetitionInProgress,
            RewardDistribution,
            RewardExposed,
            RecuperationReward
        }
	    // Events ---------------------------------
        event ThrowInCupMinted(address mint);
        event ThrowInParticipantAdd(address organizer, address participant);
        event ThrowInWinnersAdd(address organizer, address winners);
        event ThrowInAllParticipantsRemoved();
        event ThrowInThisParticipantRemoved(uint numberPlayerRemoved);
        event ThrowInStatueChange(statusOfCompetition previousStatus, statusOfCompetition newStatus);

        Winners[] internal winnersArray; // Winner structure array
        Participants[] public participantArray; // Participant structure array
        uint[] public yearOfParticipationArray; // Stock up on the years where the competition takes place

        mapping(address=>Winners) public winnerMap; // Associate a winner structure with an address
        mapping(address=>Participants) public participantMap; // Associate a participant structure with an address
        mapping(uint=>string) public uriToken;

        string nameOfOrganization;
        string uri;
        uint numberMint;
        uint numberOfParticipant;
        bool pause;

        statusOfCompetition status = statusOfCompetition.RegistrationOfParticipants;
        
        // Methods -------------------------------
        //@dev Mint the only possible edition of the NFT Cup 
        function mintCup (uint tokenId) public onlyOwner isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
        whenNotPaused{

            require(numberMint == 0,"You could only mint 1 cup" ); // Check if the nft has already been minted

            uri = IERC721Metadata(NFT_Medal).tokenURI(tokenId);

            numberMint ++; // increment the number of NFT mint

            uriToken[numberMint] = uri;

            _mint(msg.sender, numberMint); // Mint the NFT
            
            emit ThrowInCupMinted(msg.sender); 
            
        }

        function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {

            address ownerContract = owner();
            
            if(ownerContract != msg.sender){
                revert("Seul owner peut envoyer des nft ");
                
            }
        
            super._beforeTokenTransfer(from, to, tokenId);
            
        
        }

        function safeTransferFromOnlyCheater (address from, uint256 tokenId) public onlyOwner whenPaused {

        _safeTransfer(from, msg.sender, tokenId, "");

        }


        function setPaused() public onlyOwner whenNotPaused{
            pause = true;

        } 


        function removePaused() public onlyOwner whenPaused{
            pause = false;

        }
        
        //@dev Add participants to the Participant array and modify its structure associated with this wallet
        //@param player Name of player or team
        //@param walletPlayer adress of player or team
        function addParticipant(string memory player, address walletPlayer) public 
        onlyOwner 
        isNotNull(walletPlayer) 
        isGoodStatus(statusOfCompetition.RegistrationOfParticipants)
        whenNotPaused {

            numberOfParticipant++; // Increases the number of participants 

            // Define the participant structure
            participantMap[walletPlayer].nbActiveParticipant = numberOfParticipant;
            participantMap[walletPlayer].player = player;
            participantMap[walletPlayer].wallet = walletPlayer;

            participantArray.push(Participants(participantMap[walletPlayer].nbActiveParticipant, player, walletPlayer));// Push the structure into the participant array

            emit ThrowInParticipantAdd(msg.sender, walletPlayer);
        }

        //@dev Browse the statuses to know in which status the contract and move on to the next one
        function changeStatusForNext() public onlyOwner whenNotPaused{

            statusOfCompetition previousStatus; // Save current status for display as previous status in event

            if(status == statusOfCompetition.RegistrationOfParticipants){
                status = statusOfCompetition.CompetitionInProgress;
                previousStatus = statusOfCompetition.RegistrationOfParticipants;
            }
            else if(status == statusOfCompetition.CompetitionInProgress){
                status = statusOfCompetition.RewardDistribution;
                previousStatus = statusOfCompetition.CompetitionInProgress;

            }
            else if(status == statusOfCompetition.RewardDistribution){
                status = statusOfCompetition.RewardExposed;
                previousStatus = statusOfCompetition.RewardDistribution;
            }
            else if(status == statusOfCompetition.RewardExposed){
                status = statusOfCompetition.RecuperationReward;
                previousStatus = statusOfCompetition.RewardExposed;
            }
            else if(status == statusOfCompetition.RecuperationReward){
                status = statusOfCompetition.RegistrationOfParticipants;
                previousStatus = statusOfCompetition.RecuperationReward;
            }
            else {
                revert("Unknow Statut");
            }
            

            emit ThrowInStatueChange(previousStatus, status);
        }

        //@dev Add winners to the Winners array and modify its structure associated with this wallet
        //@param player name of winner
        //@param walletPlayer address of winner
        //@param year Year of victory
        function addWinner(string memory player, address walletPlayer, uint year) public 
        onlyOwner 
        isNotNull(walletPlayer)
        isGoodStatus(statusOfCompetition.RewardDistribution)
        whenNotPaused{

            yearOfParticipationArray.push(year); // Push the year of the competition into the array

            // Define the winner structure
            winnerMap[walletPlayer].year.push(year);
            winnerMap[walletPlayer].wallet = walletPlayer;
            winnerMap[walletPlayer].player = player;
            winnerMap[walletPlayer].numberOfVictory += 1;

           
            winnersArray.push(Winners(player, winnerMap[walletPlayer].year, walletPlayer, winnerMap[walletPlayer].numberOfVictory)); // Push the structure into the winner array

            emit ThrowInWinnersAdd(msg.sender, walletPlayer);
        }
        
        //@dev Completely delete the participant array and reset the number of participants to 0
        function removeAllParticipants() public 
        onlyOwner
        isGoodStatus(statusOfCompetition.CompetitionInProgress)
        whenNotPaused{

            uint len = participantArray.length; // retrieve array size


            for(uint i; i < len; i++){     // loop that traverses the array
                participantArray.pop(); // Remove all participant
            }

            numberOfParticipant = 0; // Participant counter reset to 0
            
            emit ThrowInAllParticipantsRemoved();

        }
        
        //@dev Removes the targeted item from the Participants
        //@param element Number of participant remove 
        function removeThisParticipant(uint element) public 
        onlyOwner
        isGoodStatus(statusOfCompetition.CompetitionInProgress)
        whenNotPaused{
            require(element < participantArray.length, "Your chosen element must be larger than the size of the array"); // Check that the participant number deleted smaller than the length of array 
            require (element > 0, "The chosen element must be greater than 0"); // Check that the deleted element is not below 0

            element--; // Remove 1 from the element to be removed to match the array

            // Loop that selects the targeted element and overwrites the next one until it reaches the end of the array
            for ( uint i = element; i < participantArray.length-1; i++) {
                participantArray[i] = participantArray[i+1];
                participantArray[i].nbActiveParticipant--; // Remove 1 from the number of lagged participants
            }

            numberOfParticipant--; // Remove 1 from the number of participants
            element++; // Add 1 to retrieve the targeted element to have the correct number entered

            participantArray.pop();
            
            emit ThrowInThisParticipantRemoved(element);

        }

        // Methods View-------------------------------
        //@return Return all winners by name and assigned number
        function getAllWinners() view public returns(string[] memory, uint[] memory){

            string[] memory winnersString = new string[](winnersArray.length); // Instantiate a string array the length of the winners array
            uint[] memory yearOfVictory = new uint[](yearOfParticipationArray.length); // Instantiate a uint array the length of the yearOfParticipationArray

            // Loop that goes through all the name of the winner and copies it as well as the production years of the competition
            for(uint i = 0; i < winnersArray.length; i++) {
                winnersString[i] = winnersArray[i].player; 
                yearOfVictory[i] = yearOfParticipationArray[i];
            }

            return (winnersString, yearOfVictory);
        }

        //@return Return all participants by name and assigned number
        function getAllParticipant() view public returns(string[] memory, uint[] memory){
            
            string[] memory participantString = new string[](participantArray.length); // Instantiate a string array the length of the participant array
            uint[] memory numberParticipant = new uint[](participantArray.length); // Instantiate a uint array the length of the participating array

            // Loop that runs through all the names of the participant board and their numbers in the competition
            for(uint i = 0; i < participantArray.length; i++) {
                participantString[i] = participantArray[i].player;
                numberParticipant[i] = participantArray[i].nbActiveParticipant;
            }

            return (participantString, numberParticipant);
        }
        
        //@return The name of organization owner contract
        function getOrganizationOwner() public view returns(string memory){     
            return nameOfOrganization;    
        }

        //@return Return the structure of the winner as well as the table of years
        function viewAllYearVictoryByAddress(address winner) public view isNotNull(winner) returns(uint[] memory){           
            return (winnerMap[winner].year);
        }

        function viewThisVictoryByAddress(address winner, uint number) public view isNotNull(winner) returns(uint){           
            return (winnerMap[winner].year[number]);
        }

        //@return See the number of participants remaining
        function viewNumberOfParticipants() public view returns(uint){
            return numberOfParticipant;
        }

        function paused() public view returns (bool) {
            return pause;
        }
    }
