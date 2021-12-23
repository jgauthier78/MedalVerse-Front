const chai = require('chai');
const expect = require('chai').expect;

const throwIn = artifacts.require('ThrowIn');

contract('ThrowIn', function(accounts){


    const owner = accounts[0];
    const year = 1998;
    

    const name = "Rapahel Nadal";
    const name1 = "Roger Federer";
    const name2 = "Serena Williams";

    beforeEach(async function () {
        this.throwInInstance = await throwIn.new("FITennis", { from: owner });
      });

    it("Mint du NFT Coupe", async function(){
        await this.throwInInstance.mintCup("img", {from:accounts[0]});

        let balance = await this.throwInInstance.balanceOf(accounts[0]);

        expect(balance === 1);
    })

    it("ajout de participant", async function(){
        await this.throwInInstance.addParticipant(name, accounts[1]);

        let participant = await this.throwInInstance.particip(accounts[1]);

        expect(participant.player === name , participant.wallet === accounts[1]);
    })

    it("ajout d'un Winner", async function(){
        await this.throwInInstance.addWinner(name, accounts[1], year);

        let winner = await this.throwInInstance.win(accounts[1]);

        let whatYear = await this.throwInInstance.yearOfParticipation([0]);

        expect(winner.player === name, winner.wallet === accounts[1], winner.year === whatYear, winner.numberOfVictory === 1);
    })

    it("Supprime tous les participant", async function(){
        await this.throwInInstance.addParticipant(name, accounts[1]);
        await this.throwInInstance.addParticipant(name1, accounts[2]);

        await this.throwInInstance.removeAllParticipants({from: owner})

        balanceOfParticipant = await this.throwInInstance.viewNumberOfParticipants();

        expect(balanceOfParticipant === 0);
    })

    it("Supprimé un participant", async function(){
        await this.throwInInstance.addParticipant(name, accounts[1]);
        await this.throwInInstance.addParticipant(name1, accounts[2]);
        await this.throwInInstance.addParticipant(name2, accounts[3]);

        await this.throwInInstance.removeThisParticipant(1);

        participant = await this.throwInInstance.participant(0);

        expect(participant.player === name1, participant.wallet === accounts[2]);
    })
    
})