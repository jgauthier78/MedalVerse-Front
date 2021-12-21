// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


    contract ThrowIn is ERC721URIStorage, Ownable {
        
        constructor() ERC721 ("WorldCup", "WdC"){
        }

        event cupMinted(address mint);
        event participantAdd(address organizer, address participant);
        event winnersAdd(address organizer, address winners);


        struct Winners {
            string team;
            uint year;
            address wallet;
            uint numberOfVictory;
        }


        struct Participants {
            uint nbActiveParticipant;
            string team;
            address wallet;
        }


        Winners[] internal winners;
        Participants[] internal participants;

        mapping(address=>Winners) internal win;
        mapping(address=>Participants) internal particip;


        uint numberMint;
        uint numberOfParticipant;

        function mintCup (string memory tokenURI) public onlyOwner returns (uint256){

            require(numberMint == 0,"You could only mint 1 cup" );

            numberMint ++;

             _mint(msg.sender, numberMint);
            _setTokenURI(numberMint, tokenURI);
 
            emit cupMinted(msg.sender);

            return numberMint;
        }

        function addParticipant(string memory team, address walletTeam) public onlyOwner {

            numberOfParticipant++;

            particip[walletTeam].nbActiveParticipant = numberOfParticipant;
            particip[walletTeam].team = team;
            particip[walletTeam].wallet = walletTeam;

            Participants memory newParticipant = Participants(particip[walletTeam].nbActiveParticipant, team, walletTeam);
            participants.push(newParticipant);

            emit participantAdd(msg.sender, walletTeam);
        }


        function addWinners(string memory team, uint year, address walletTeam) public onlyOwner {

            win[walletTeam].wallet = walletTeam;
            win[walletTeam].team = team;
            win[walletTeam].numberOfVictory += 1;

            Winners memory newWinners = Winners(team, year, walletTeam, win[walletTeam].numberOfVictory);
            winners.push(newWinners);

            emit winnersAdd(msg.sender, walletTeam);
        }

        function removeAllParticipant() public onlyOwner {

            uint len = participants.length;

            for(uint i; i < len; i++){
                participants.pop();
            }

            numberOfParticipant = 0;

        }

        function removeThisParticipant(uint element) public onlyOwner{
            require(element < participants.length, "Your chosen element must be larger than the size of the array");

            element--;

            for ( uint i = element; i < participants.length-1; i++) {
                participants[i] = participants[i+1];
                participants[i].nbActiveParticipant--;
            }

            numberOfParticipant--;

            participants.pop();         

        }

        function getAllWinners() view public returns(string[] memory, uint[] memory){

            string[] memory winnersString = new string[](winners.length);
            uint[] memory yearOfVictory = new uint[](winners.length);

            for(uint i = 0; i < winners.length; i++) {
                winnersString[i] = winners[i].team;
                yearOfVictory[i] = winners[i].year;
            }

            return (winnersString, yearOfVictory);
        }


        function getAllParticipant() view public returns(string[] memory, uint[] memory){
            
            string[] memory participantString = new string[](participants.length);
            uint[] memory numberParticipant = new uint[](participants.length);

            for(uint i = 0; i < participants.length; i++) {
                participantString[i] = participants[i].team;
                numberParticipant[i] = participants[i].nbActiveParticipant;
            }

            return (participantString, numberParticipant);
        }

    }
