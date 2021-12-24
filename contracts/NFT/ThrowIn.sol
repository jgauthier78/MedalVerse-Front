// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


    contract ThrowIn is ERC721Pausable, Ownable {
        
        constructor(string memory oragnization) ERC721 ("Roland Garros", "RLG"){
        
        nameOfOrganization = oragnization;
        }

        struct Winners {
            string player;
            uint[] year;
            address wallet;
            uint numberOfVictory;
        }

        struct Participants {
            uint nbActiveParticipant;
            string player;
            address wallet;
        }

        // Data ---------------------------------
	    //   Events
        event cupMinted(address mint);
        event participantAdd(address organizer, address participant);
        event winnersAdd(address organizer, address winners);
        event allParticipantsRemoved();
        event thisParticipantRemoved(uint numberPlayerRemoved);

        Winners[] internal winners; // Winner structure array
        Participants[] public participant; // Participant structure array
        uint[] public yearOfParticipation; // Stock up on the years where the competition takes place

        mapping(address=>Winners) public win; // Associate a winner structure with an address
        mapping(address=>Participants) public particip; // Associate a participant structure with an address

        string nameOfOrganization;
        uint numberMint;
        uint numberOfParticipant;
        
        // Methods -------------------------------
        //@dev Mint the only possible edition of the NFT Cup 
        function mintCup () public onlyOwner  (){

            require(numberMint == 0,"You could only mint 1 cup" ); // Check if the nft has already been minted

            numberMint ++; // increment the number of nft mint

            _mint(msg.sender, numberMint); // Mint the NFT
            
            emit cupMinted(msg.sender); 
            
        }
        
        //@dev Add participants to the Participant array and modify its structure associated with this wallet
        //@param player Name of player or team
        //@param walletPlayer adress of player or team
        function addParticipant(string memory player, address walletPlayer) public onlyOwner {

            numberOfParticipant++; // Increases the number of participants 

            // Define the participant structure
            particip[walletPlayer].nbActiveParticipant = numberOfParticipant;
            particip[walletPlayer].player = player;
            particip[walletPlayer].wallet = walletPlayer;

            // Create an instance of the participant array and integrate a participant into the array
            Participants memory newParticipant = Participants(particip[walletPlayer].nbActiveParticipant, player, walletPlayer);
            participant.push(newParticipant); // Push the structure into the participant array

            emit participantAdd(msg.sender, walletPlayer);
        }

        //@dev Add winners to the Winners array and modify its structure associated with this wallet
        //@param player name of winner
        //@param walletPlayer address of winner
        //@param year Year of victory
        function addWinner(string memory player, address walletPlayer, uint year) public onlyOwner {

            yearOfParticipation.push(year); // Push the year of the competition into the array

            // Define the winner structure
            win[walletPlayer].year.push(year);
            win[walletPlayer].wallet = walletPlayer;
            win[walletPlayer].player = player;
            win[walletPlayer].numberOfVictory += 1;

            // Create an instance of the Winners array and integrate a winner into the array
            Winners memory newWinners = Winners(player, win[walletPlayer].year, walletPlayer, win[walletPlayer].numberOfVictory);
            winners.push(newWinners); // Push the structure into the winner array

            emit winnersAdd(msg.sender, walletPlayer);
        }
        
        //@dev Completely delete the participant array and reset the number of participants to 0
        function removeAllParticipants() public onlyOwner {

            uint len = participant.length; // retrieve array size


            for(uint i; i < len; i++){     // loop that traverses the array
                participant.pop(); // Remove all participant
            }

            numberOfParticipant = 0; // Participant counter reset to 0
            
            emit allParticipantsRemoved();

        }
        
        //@dev Removes the targeted item from the Participants
        //@param element Number of participant remove 
        function removeThisParticipant(uint element) public onlyOwner{
            require(element < participant.length, "Your chosen element must be larger than the size of the array"); // Check that the participant number deleted smaller than the length of array 

            element--; 

            for ( uint i = element; i < participant.length-1; i++) {
                participant[i] = participant[i+1];
                participant[i].nbActiveParticipant--;
            }

            numberOfParticipant--;
            element++;

            participant.pop();
            
            emit thisParticipantRemoved(element);

        }
        
        //@return Return all winners by name and assigned number
        function getAllWinners() view public returns(string[] memory, uint[] memory){

            string[] memory winnersString = new string[](winners.length);
            uint[] memory yearOfVictory = new uint[](yearOfParticipation.length);

            for(uint i = 0; i < winners.length; i++) {
                winnersString[i] = winners[i].player;
                yearOfVictory[i] = yearOfParticipation[i];
            }

            return (winnersString, yearOfVictory);
        }

        //@return Return all participants by name and assigned number
        function getAllParticipant() view public returns(string[] memory, uint[] memory){
            
            string[] memory participantString = new string[](participant.length);
            uint[] memory numberParticipant = new uint[](participant.length);

            for(uint i = 0; i < participant.length; i++) {
                participantString[i] = participant[i].player;
                numberParticipant[i] = participant[i].nbActiveParticipant;
            }

            return (participantString, numberParticipant);
        }
        
        
        function getOrganizationOwner() public view returns(string memory){
        
            return nameOfOrganization;
        
        }

        function viewWinnersByAddress(address winner) public view returns(string memory, uint[] memory, address, uint){
            
            return (win[winner].player, win[winner].year, win[winner].wallet, win[winner].numberOfVictory);

        }

        function viewNumberOfParticipants() public view returns(uint){

            return numberOfParticipant;

        }
    }
