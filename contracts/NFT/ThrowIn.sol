// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";


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


        struct Participant {
            uint nbActiveParticipant;
            string team;
            address wallet;
        }


        Winners[] public winners;


        mapping(address=>Winners) public win;
        mapping(address=>Participant) public participant;


        uint numberMint;


        function mintCup (string memory tokenURI) public onlyOwner returns (uint256){

            require(numberMint == 0,"You could only mint 1 cup" );

            numberMint ++;

             _mint(msg.sender, numberMint);
            _setTokenURI(numberMint, tokenURI);
 
            emit cupMinted(msg.sender);

            return numberMint;
        }


        function addParticipant(string memory team, address walletTeam) public onlyOwner {

            participant[walletTeam].nbActiveParticipant++;
            participant[walletTeam].team = team;
            participant[walletTeam].wallet = walletTeam;

            emit participantAdd(msg.sender, walletTeam);
        }


        function addWinners(string memory team, uint year, address walletTeam) public onlyOwner {
            
            win[walletTeam].numberOfVictory += 1; 
            Winners memory nouveauWinners = Winners(team, year, walletTeam, win[walletTeam].numberOfVictory);
            winners.push(nouveauWinners);

            emit winnersAdd(msg.sender, walletTeam);
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
            
            string[] memory participantString = new string[](winners.length);
            uint[] memory numberParticipant = new uint[](winners.length);

            for(uint i = 0; i < winners.length; i++) {
                participantString[i] = winners[i].team;
                numberParticipant[i] = winners[i].year;
            }

            return (participantString, numberParticipant);
        }


    }