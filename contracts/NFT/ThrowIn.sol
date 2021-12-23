// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    //@dev Add winners to the Winners array and modify its structure associated with this wallet
    contract ThrowIn is ERC721URIStorage, Ownable {
        
        constructor(string memory oragnization) ERC721 ("Roland Garros", "RLG"){
        
        nameOfOrganization = name
        }

        event cupMinted(address mint);
        event participantAdd(address organizer, address participant);
        event winnersAdd(address organizer, address winners);
        event allParticipantsRemoved();
        event thisParticipantRemoved(uint numberTeamRemoved);


        struct Winners {
            string player;
            uint year;
            address wallet;
            uint numberOfVictory;
        }


        struct Participants {
            uint nbActiveParticipant;
            string player;
            address wallet;
        }


        Winners[] internal winners;
        Participants[] internal participants;

        mapping(address=>Winners) internal win;
        mapping(address=>Participants) internal particip;
       

        
        string nameOfOrganization;
        uint numberMint;
        uint numberOfParticipant;
        
        //@dev Mint the only possible edition of the NFT World Cup
        function mintCup (string memory tokenURI) public onlyOwner returns (uint256){

            require(numberMint == 0,"You could only mint 1 cup" );

            numberMint ++;

             _mint(msg.sender, numberMint);
            _setTokenURI(numberMint, tokenURI);
 
            emit cupMinted(msg.sender);

            return numberMint;
        }
        
        //@dev Add participants to the Participant array and modify its structure associated with this wallet
        function addParticipant(string memory team, address walletTeam) public onlyOwner {

            numberOfParticipant++;

            particip[walletTeam].nbActiveParticipant = numberOfParticipant;
            particip[walletTeam].player = team;
            particip[walletTeam].wallet = walletTeam;

            Participants memory newParticipant = Participants(particip[walletTeam].nbActiveParticipant, team, walletTeam);
            participants.push(newParticipant);

            emit participantAdd(msg.sender, walletTeam);
        }

        //@dev Add winners to the Winners array and modify its structure associated with this wallet
        function addWinners(string memory team, uint year, address walletTeam) public onlyOwner {

            win[walletTeam].wallet = walletTeam;
            win[walletTeam].player = team;
            win[walletTeam].numberOfVictory += 1;

            Winners memory newWinners = Winners(team, year, walletTeam, win[walletTeam].numberOfVictory);
            winners.push(newWinners);

            emit winnersAdd(msg.sender, walletTeam);
        }
        
        //@dev Completely delete the participant array and reset the number of participants to 0
        function removeAllParticipant() public onlyOwner {

            uint len = participants.length;

            for(uint i; i < len; i++){
                participants.pop();
            }

            numberOfParticipant = 0;
            
            emit allParticipantsRemoved();

        }
        
        //@dev Removes the targeted item from the Participants
        function removeThisParticipant(uint element) public onlyOwner{
            require(element < participants.length, "Your chosen element must be larger than the size of the array");

            element--;

            for ( uint i = element; i < participants.length-1; i++) {
                participants[i] = participants[i+1];
                participants[i].nbActiveParticipant--;
            }

            numberOfParticipant--;
            element++;

            participants.pop();
            
            emit thisParticipantsRemoved(element);

        }
        
        //@dreturn Return all winners by name and assigned number
        function getAllWinners() view public returns(string[] memory, uint[] memory){

            string[] memory winnersString = new string[](winners.length);
            uint[] memory yearOfVictory = new uint[](winners.length);

            for(uint i = 0; i < winners.length; i++) {
                winnersString[i] = winners[i].player;
                yearOfVictory[i] = winners[i].year;
            }

            return (winnersString, yearOfVictory);
        }

        //@return Return all participants by name and assigned number
        function getAllParticipant() view public returns(string[] memory, uint[] memory){
            
            string[] memory participantString = new string[](participants.length);
            uint[] memory numberParticipant = new uint[](participants.length);

            for(uint i = 0; i < participants.length; i++) {
                participantString[i] = participants[i].player;
                numberParticipant[i] = participants[i].nbActiveParticipant;
            }

            return (participantString, numberParticipant);
        }
        
        function getOrganizationOwner() public view returns(string memory){
        
            return nameOfOrganization;
        
        }
    }
