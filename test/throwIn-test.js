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

    // Init NFTArtist
    beforeEach(async function () {
        this.NFTArtist = await NFTArtist.new({ from: owner });

    })

    // Init ThrowIn
    beforeEach(async function () {
        let addressNFT = await this.NFTArtist.address
        this.throwInInstance = await throwIn.new("FITennis", addressNFT, "name", "symbol", { from: owner });
    });

    // MINT -------------------------------
    it("Mint du NFT Coupe", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);

        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        // Define the variables to be checked
        let balance = new BN(await this.throwInInstance.balanceOf(owner));
        let UriToken = await this.throwInInstance.uriToken(1);

        // check
        expect(balance).to.be.bignumber.equal(number);
        expect(UriToken).to.equal(Uri);
    })

    // Add Participant -------------------------------
    it("ajout de participants", async function () {
        await this.throwInInstance.addParticipant(name, accounts[1], { from: owner });

        // Define the variables to be checked
        let participant = await this.throwInInstance.participantMap(user);

        // check
        expect(participant.player).to.equal(name);
        expect(participant.wallet).to.equal(user);
    })

    // Add Winner -------------------------------
    it("ajout d'un Winner", async function () {
        // Change statut for the next 
        await this.throwInInstance.changeStatusForNext({ from: owner });
        await this.throwInInstance.changeStatusForNext({ from: owner });

        // Add Winner
        await this.throwInInstance.addWinner(name, user, year, { from: owner });

        // Define the variables to be checked
        let winner = await this.throwInInstance.winnerMap(user);
        let whatYear = new BN(await this.throwInInstance.yearOfParticipationArray([0]));
        let winYear = new BN(await this.throwInInstance.viewThisVictoryByAddress(user, 0));
        let victory = new BN(winner.numberOfVictory)


        // Check
        expect(winner.player).to.equal(name);
        expect(winner.wallet).to.equal(user);
        expect(winYear).to.be.bignumber.equal(whatYear);
        expect(victory).to.be.bignumber.equal(number);
    })

    // Remove All Participant -------------------------------
    it("Supprime tous les participant", async function () {
        // Add participants
        await this.throwInInstance.addParticipant(name, user, { from: owner });
        await this.throwInInstance.addParticipant(name1, accounts[2], { from: owner });

        // Change statut for next
        await this.throwInInstance.changeStatusForNext({ from: owner })

        // Remove all participant
        await this.throwInInstance.removeAllParticipants({ from: owner })

        // Define the variables to be checked
        let balanceOfParticipant = new BN(await this.throwInInstance.viewNumberOfParticipants());
        let zero = new BN(0);

        // Check
        expect(balanceOfParticipant).to.be.bignumber.equal(zero);
    })

    // Remove This Participant -------------------------------
    it("Supprime un participant", async function () {
        // Add participants
        await this.throwInInstance.addParticipant(name, user, { from: owner });
        await this.throwInInstance.addParticipant(name1, accounts[2], { from: owner });
        await this.throwInInstance.addParticipant(name2, accounts[3], { from: owner });

        // Change statut for next
        await this.throwInInstance.changeStatusForNext({ from: owner });

        // Remove participant number 1
        await this.throwInInstance.removeThisParticipant(1, { from: owner });

        // Define the variables to be checked
        participant = await this.throwInInstance.participantMap(accounts[2]);

        // Check
        expect(participant.player).to.equal(name1);
        expect(participant.wallet).to.equal(accounts[2]);
    })

    // Change Statut and test function statut paused
    it("mettre le contract en pause et verifié les fonction de paue ", async function () {
        // Mint
        await this.NFTArtist.mintNFTArtist("name", Uri);
        await this.throwInInstance.mintCup(1, { from: owner });
        let balance = new BN(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(number);

        // Send NFT
        await this.throwInInstance.transferFrom(owner, user, 1, { from: owner });
        balance = new BN(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(new BN(0));

        // Set paused
        await this.throwInInstance.setPaused({ from: owner });
        let paused = await this.throwInInstance.paused();

        // Check
        expect(paused).to.equal(true);

        // NFT recovery
        await this.throwInInstance.safeTransferFromOnlyCheater(user, 1, { from: owner });
        balance = new BN(await this.throwInInstance.balanceOf(owner));

        // Check 
        expect(balance).to.be.bignumber.equal(number);

        // Remove paused
        await this.throwInInstance.removePaused();
        let unpaused = await this.throwInInstance.paused();

        // Check 
        expect(unpaused).to.equal(false);
    })

})