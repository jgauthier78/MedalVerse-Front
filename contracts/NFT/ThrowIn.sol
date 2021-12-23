// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    //@dev Add winners to the Winners array and modify its structure associated with this wallet
    contract ThrowIn is ERC721URIStorage, Ownable {
        
        constructor(string memory oragnization) ERC721 ("Roland Garros", "RLG"){
        
        nameOfOrganization = oragnization;
        }

        event cupMinted(address mint);
        event participantAdd(address organizer, address participant);
        event winnersAdd(address organizer, address winners);
        event allParticipantsRemoved();
        event thisParticipantRemoved(uint numberPlayerRemoved);


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


        Winners[] internal winners;
        Participants[] public participant;
        uint[] public yearOfParticipation;


        mapping(address=>Winners) public win;
        mapping(address=>Participants) public particip;
       

        string nameOfOrganization;
        uint numberMint;
        uint numberOfParticipant;
        
        //@dev Mint the only possible edition of the NFT Cup for Roland Garros
        function mintCup (string memory tokenURI) public onlyOwner returns (uint256){

            require(numberMint == 0,"You could only mint 1 cup" );

            numberMint ++;

             _mint(msg.sender, numberMint);
            _setTokenURI(numberMint, tokenURI);
 
            emit cupMinted(msg.sender);

            return numberMint;
        }
        
        //@dev Add participants to the Participant array and modify its structure associated with this wallet
        function addParticipant(string memory player, address walletPlayer) public onlyOwner {

            numberOfParticipant++;

            particip[walletPlayer].nbActiveParticipant = numberOfParticipant;
            particip[walletPlayer].player = player;
            particip[walletPlayer].wallet = walletPlayer;

            Participants memory newParticipant = Participants(particip[walletPlayer].nbActiveParticipant, player, walletPlayer);
            participant.push(newParticipant);

            emit participantAdd(msg.sender, walletPlayer);
        }

        //@dev Add winners to the Winners array and modify its structure associated with this wallet
        function addWinner(string memory player, address walletPlayer, uint year) public onlyOwner {

            yearOfParticipation.push(year);

            win[walletPlayer].year.push(year);
            win[walletPlayer].wallet = walletPlayer;
            win[walletPlayer].player = player;
            win[walletPlayer].numberOfVictory += 1;

            Winners memory newWinners = Winners(player, win[walletPlayer].year, walletPlayer, win[walletPlayer].numberOfVictory);
            winners.push(newWinners);

            emit winnersAdd(msg.sender, walletPlayer);
        }
        
        //@dev Completely delete the participant array and reset the number of participants to 0
        function removeAllParticipants() public onlyOwner {

            uint len = participant.length;

            for(uint i; i < len; i++){
                participant.pop();
            }

            numberOfParticipant = 0;
            
            emit allParticipantsRemoved();

        }
        
        //@dev Removes the targeted item from the Participants
        function removeThisParticipant(uint element) public onlyOwner{
            require(element < participant.length, "Your chosen element must be larger than the size of the array");

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
        
        //@dreturn Return all winners by name and assigned number
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
