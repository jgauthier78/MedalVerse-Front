// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


    contract ThrowIn is ERC721Pausable, Ownable {

        IERC721 NFT_Medal; // Recovering an ERC721 interface
        
        constructor(string memory oragnization, address addressNFT_Medal) ERC721 ("Roland Garros", "RLG"){
        
        NFT_Medal = IERC721(addressNFT_Medal);
        nameOfOrganization = oragnization;
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

        mapping(address=>Winners) public winMap; // Associate a winner structure with an address
        mapping(address=>Participants) public participMap; // Associate a participant structure with an address

        string nameOfOrganization;
        uint numberMint;
        uint numberOfParticipant;

        statusOfCompetition status = statusOfCompetition.RegistrationOfParticipants;
        
        // Methods -------------------------------
        //@dev Mint the only possible edition of the NFT Cup 
        function mintCup () public onlyOwner isGoodStatus(statusOfCompetition.RegistrationOfParticipants){

            require(numberMint == 0,"You could only mint 1 cup" ); // Check if the nft has already been minted

            numberMint ++; // increment the number of nft mint

            _mint(msg.sender, numberMint); // Mint the NFT
            
            emit ThrowInCupMinted(msg.sender); 
            
        }
        
        //@dev Add participants to the Participant array and modify its structure associated with this wallet
        //@param player Name of player or team
        //@param walletPlayer adress of player or team
        function addParticipant(string memory player, address walletPlayer) public 
        onlyOwner 
        isNotNull(walletPlayer) 
        isGoodStatus(statusOfCompetition.RegistrationOfParticipants) {

            numberOfParticipant++; // Increases the number of participants 

            // Define the participant structure
            participMap[walletPlayer].nbActiveParticipant = numberOfParticipant;
            participMap[walletPlayer].player = player;
            participMap[walletPlayer].wallet = walletPlayer;

            participantArray.push(Participants(participMap[walletPlayer].nbActiveParticipant, player, walletPlayer));// Push the structure into the participant array

            emit ThrowInParticipantAdd(msg.sender, walletPlayer);
        }

        function changeStatusForNext() public onlyOwner{

            statusOfCompetition previousStatus;

            if(status == statusOfCompetition.RegistrationOfParticipants){
                status = statusOfCompetition.CompetitionInProgress;
                previousStatus = statusOfCompetition.RegistrationOfParticipants;
            }
            if(status == statusOfCompetition.CompetitionInProgress){
                status = statusOfCompetition.RewardDistribution;
                previousStatus = statusOfCompetition.CompetitionInProgress;
            }
            if(status == statusOfCompetition.RewardDistribution){
                status = statusOfCompetition.RewardExposed;
                previousStatus = statusOfCompetition.RewardDistribution;
            }
            if(status == statusOfCompetition.RewardExposed){
                status = statusOfCompetition.RecuperationReward;
                previousStatus = statusOfCompetition.RewardExposed;
            }
            if(status == statusOfCompetition.RecuperationReward){
                status = statusOfCompetition.RegistrationOfParticipants;
                previousStatus = statusOfCompetition.RecuperationReward;
            }

            emit ThrowInStatueChange(previousStatus, status);
        }

        //@dev Add winners to the Winners array and modify its structure associated with this wallet
        //@param player name of winner
        //@param walletPlayer address of winner
        //@param year Year of victory
        function addWinner(string memory player, address walletPlayer, uint year) public onlyOwner isNotNull(walletPlayer){

            yearOfParticipationArray.push(year); // Push the year of the competition into the array

            // Define the winner structure
            winMap[walletPlayer].year.push(year);
            winMap[walletPlayer].wallet = walletPlayer;
            winMap[walletPlayer].player = player;
            winMap[walletPlayer].numberOfVictory += 1;

           
            winnersArray.push(Winners(player, winMap[walletPlayer].year, walletPlayer, winMap[walletPlayer].numberOfVictory)); // Push the structure into the winner array

            emit ThrowInWinnersAdd(msg.sender, walletPlayer);
        }
        
        //@dev Completely delete the participant array and reset the number of participants to 0
        function removeAllParticipants() public onlyOwner{

            uint len = participantArray.length; // retrieve array size


            for(uint i; i < len; i++){     // loop that traverses the array
                participantArray.pop(); // Remove all participant
            }

            numberOfParticipant = 0; // Participant counter reset to 0
            
            emit ThrowInAllParticipantsRemoved();

        }
        
        //@dev Removes the targeted item from the Participants
        //@param element Number of participant remove 
        function removeThisParticipant(uint element) public onlyOwner{
            require(element < participantArray.length, "Your chosen element must be larger than the size of the array"); // Check that the participant number deleted smaller than the length of array 
            require (element > 0, "The chosen element must be greater than 0");

            element--; 

            for ( uint i = element; i < participantArray.length-1; i++) {
                participantArray[i] = participantArray[i+1];
                participantArray[i].nbActiveParticipant--;
            }

            numberOfParticipant--;
            element++;

            participantArray.pop();
            
            emit ThrowInThisParticipantRemoved(element);

        }
        
        //@return Return all winners by name and assigned number
        function getAllWinners() view public returns(string[] memory, uint[] memory){

            string[] memory winnersString = new string[](winnersArray.length);
            uint[] memory yearOfVictory = new uint[](yearOfParticipationArray.length);

            for(uint i = 0; i < winnersArray.length; i++) {
                winnersString[i] = winnersArray[i].player;
                yearOfVictory[i] = yearOfParticipationArray[i];
            }

            return (winnersString, yearOfVictory);
        }

        //@return Return all participants by name and assigned number
        function getAllParticipant() view public returns(string[] memory, uint[] memory){
            
            string[] memory participantString = new string[](participantArray.length);
            uint[] memory numberParticipant = new uint[](participantArray.length);

            for(uint i = 0; i < participantArray.length; i++) {
                participantString[i] = participantArray[i].player;
                numberParticipant[i] = participantArray[i].nbActiveParticipant;
            }

            return (participantString, numberParticipant);
        }
        
        //@return
        function getOrganizationOwner() public view returns(string memory){
        
            return nameOfOrganization;
        
        }

        //@return
        function viewWinnersByAddress(address winner) public view isNotNull(winner) returns(string memory, uint[] memory, address, uint){
            
            return (winMap[winner].player, winMap[winner].year, winMap[winner].wallet, winMap[winner].numberOfVictory);

        }

        //@return
        function viewNumberOfParticipants() public view returns(uint){

            return numberOfParticipant;

        }
    }