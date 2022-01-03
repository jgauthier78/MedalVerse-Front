var BigNumber = require('bignumber.js');
var chai = require('chai');
var expect = require('chai').expect

const throwIn = artifacts.require('ThrowIn');
const NFTArtist = artifacts.require('NFTArtist')
contract('ThrowIn', function (accounts) {


    const owner = accounts[0];
    const user = accounts[1]
    const year = new BigNumber(1998);
    const number = new BigNumber(1);
    const Uri = "img";
    const zero = new BigNumber(0);

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
        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner));
        let UriToken = await this.throwInInstance.uriToken(1);

        // check
        console.log("Check la balance et l'Uri ...");
        expect(balance).to.be.bignumber.equal(number);
        expect(UriToken).to.equal(Uri);

        console.log("-------------------------------")
        console.log("balance:" + balance + " = " + number);
        console.log("Uri du token: " + UriToken + " = " + Uri);
        console.log("-------------------------------")
    })

    // Add Participant -------------------------------
    it("ajout de participants", async function () {
        await this.throwInInstance.addParticipant(name, accounts[1], { from: owner });

        // Define the variables to be checked
        let participant = await this.throwInInstance.participantMap(user);

        // check
        console.log("Check la structure du participant ...")
        expect(participant.player).to.equal(name);
        expect(participant.wallet).to.equal(user);

        console.log("-------------------------------")
        console.log("Nom du participant: " + participant.player + " = " + name);
        console.log("Wallet du participant: " + participant.wallet + " = " + user);
        console.log("-------------------------------")
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
        let whatYear = new BigNumber(await this.throwInInstance.yearOfParticipationArray([0]));
        let winYear = new BigNumber(await this.throwInInstance.viewThisVictoryByAddress(user, 0));
        let victory = new BigNumber(winner.numberOfVictory)


        // Check
        console.log("Check la structure du gagnant ...")
        expect(winner.player).to.equal(name);
        expect(winner.wallet).to.equal(user);
        expect(winYear).to.be.bignumber.equal(whatYear);
        expect(victory).to.be.bignumber.equal(number);

        console.log("-------------------------------")
        console.log("Nom du gagnant: " + winner.player + " = " + name);
        console.log("Wallet du gagnant: " + winner.wallet + " = " + user);
        console.log("Année de victoire: " + winYear + " = " + whatYear);
        console.log("Nombre de victoire: " + victory + " = " + number);
        console.log("-------------------------------")
    })

    // Remove All Participant -------------------------------
    it("Supprime tous les participant", async function () {
        // Add participants
        await this.throwInInstance.addParticipant(name, user, { from: owner });
        await this.throwInInstance.addParticipant(name1, accounts[2], { from: owner });

        // Change statut for next
        await this.throwInInstance.changeStatusForNext({ from: owner });

        // Remove all participant
        await this.throwInInstance.changeStatusForNext({ from: owner });

        // Define the variables to be checked
        let balanceOfParticipant = new BigNumber(await this.throwInInstance.viewNumberOfParticipants());


        // Check
        console.log("Verifie que le tableau participant est vide ... ")
        expect(balanceOfParticipant).to.be.bignumber.equal(zero);

        console.log("-------------------------------")
        console.log("Nombre de participant dans le tableau est de : " + balanceOfParticipant + " = " + zero)
        console.log("-------------------------------")
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
        console.log("Verifie le changement de position du participant numéro 2 ...")
        expect(participant.player).to.equal(name1);
        expect(participant.wallet).to.equal(accounts[2]);

        console.log("-------------------------------")
        console.log("Nom du nouveau participant 1: " + participant.player + " = " + name1)
        console.log("Wallet du nouveau participant 1: " + participant.wallet + " = " + accounts[2])
        console.log("-------------------------------")
    })

    // Change Statut and test function statut paused
    it("mettre le contract en pause et verifié les fonction de pause ", async function () {
        // Mint
        await this.NFTArtist.mintNFTArtist("name", Uri);
        await this.throwInInstance.mintCup(1, { from: owner });
        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(number);
        console.log("-------------------------------")
        console.log("Vérification de la balance: " + balance + " = " + number)

        // Send NFT
        await this.throwInInstance.transferFrom(owner, user, 1, { from: owner });
        balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(zero);
        console.log("Vérification de la balance aprés l'envoie: " + balance + " = " + zero)

        // Set paused
        await this.throwInInstance.setPaused({ from: owner });
        let paused = await this.throwInInstance.paused();

        // Check
        expect(paused).to.equal(true);
        console.log("Vérifie la mise en pause du contrat: " + paused + " = " + true)

        // NFT recovery
        await this.throwInInstance.safeTransferFromWithoutPermission(user, 1, { from: owner });
        balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check 
        expect(balance).to.be.bignumber.equal(number);
        console.log("Vérifie la balance apres la recuperation du NFT: " + balance + " = " + number)

        // Remove paused
        await this.throwInInstance.removePaused();
        let unpaused = await this.throwInInstance.paused();

        // Check 
        expect(unpaused).to.equal(false);
        console.log("Verifie que pause a étais enlever: " + unpaused + " = " + false)
        console.log("-------------------------------")
    })

})