const { BN } = require('@openzeppelin/test-helpers');
const expect = require('chai').expect;

const throwIn = artifacts.require('ThrowIn');
const NFTArtist = artifacts.require('NFTArtist')
contract('ThrowIn', function (accounts) {


    const owner = accounts[0];
    const user = accounts[1]
    const year = new BN(1998);
    const number = new BN(1);
    const Uri = "img";

    const name = "Rapahel Nadal";
    const name1 = "Roger Federer";
    const name2 = "Serena Williams";

    beforeEach(async function () {
        this.NFTArtist = await NFTArtist.new({from: owner});

    })

    beforeEach(async function () {
        let addressNFT = await this.NFTArtist.address
        this.throwInInstance = await throwIn.new("FITennis", addressNFT, "name", "symbol", { from: owner });  
    });

    // MINT -------------------------------
    it("Mint du NFT Coupe", async function () {
        await this.NFTArtist.mintNFTArtist("name" ,Uri);

        await this.throwInInstance.mintCup(1, { from: owner });

        let balance = new BN(await this.throwInInstance.balanceOf(owner));
        let UriToken = await this.throwInInstance.uriToken(1);
        
        console.log(UriToken)
        // check
        expect(balance).to.be.bignumber.equal(number);
        expect(UriToken).to.equal(Uri);
    })

    // Add Participant -------------------------------
    it("ajout de participant", async function () {
        await this.throwInInstance.addParticipant(name, accounts[1], {from: owner});

        let participant = await this.throwInInstance.participantMap(user);

        // check
        expect(participant.player).to.equal(name);
        expect(participant.wallet).to.equal(user);
    })

    // Add Winner -------------------------------
    it("ajout d'un Winner", async function () {

        await this.throwInInstance.changeStatusForNext({from: owner});
        await this.throwInInstance.changeStatusForNext({from: owner});

        
        await this.throwInInstance.addWinner(name, user, year, {from: owner});

        let winner = await this.throwInInstance.winnerMap(user);
        let whatYear = new BN(await this.throwInInstance.yearOfParticipationArray([0]));
        let winYear = new BN(await this.throwInInstance.viewThisVictoryByAddress(user, 0));
        let victory = new BN(winner.numberOfVictory)
        
        
        // check
        expect(winner.player).to.equal(name);
        expect(winner.wallet).to.equal(user);
        expect(winYear).to.be.bignumber.equal(whatYear); 
        expect(victory).to.be.bignumber.equal(number);
    })

    // Remove All Participant -------------------------------
    it("Supprime tous les participant", async function () {
        await this.throwInInstance.addParticipant(name, user, {from: owner});
        await this.throwInInstance.addParticipant(name1, accounts[2], {from: owner});

        await this.throwInInstance.changeStatusForNext({from: owner})

        await this.throwInInstance.removeAllParticipants({ from: owner })

        let balanceOfParticipant = new BN(await this.throwInInstance.viewNumberOfParticipants());
        let zero = new BN(0);

        // check
        expect(balanceOfParticipant).to.be.bignumber.equal(zero);
    })

    // Remove This Participant -------------------------------
    it("Supprime un participant", async function () {
        await this.throwInInstance.addParticipant(name, user, {from: owner});
        await this.throwInInstance.addParticipant(name1, accounts[2], {from: owner});
        await this.throwInInstance.addParticipant(name2, accounts[3], {from: owner});

        await this.throwInInstance.changeStatusForNext({from: owner});

        await this.throwInInstance.removeThisParticipant(1, {from: owner});

        participant = await this.throwInInstance.participantMap(accounts[2]);

        // check
        expect(participant.player).to.equal(name1);
        expect(participant.wallet).to.equal(accounts[2]);
    })

    it("mettre le contract en pause", async function (){
        await this.NFTArtist.mintNFTArtist("name" ,Uri);
        await this.throwInInstance.mintCup(1, { from: owner });

        let balance = new BN(await this.throwInInstance.balanceOf(owner));
        expect(balance).to.be.bignumber.equal(number);

        await this.throwInInstance.transferFrom(owner, user, 1, {from: owner});
        balance = new BN(await this.throwInInstance.balanceOf(owner));
        expect(balance).to.be.bignumber.equal(new BN(0));

        await this.throwInInstance.setPaused({from: owner });
        let paused = await this.throwInInstance.paused();
        expect(paused).to.equal(true);

        await this.throwInInstance.safeTransferFromOnlyCheater(user, 1, {from: owner});
        balance = new BN(await this.throwInInstance.balanceOf(owner));
        expect(balance).to.be.bignumber.equal(number);

        await this.throwInInstance.removePaused();
        let unpaused = await this.throwInInstance.paused();
        expect(unpaused).to.equal(false);
    })

})