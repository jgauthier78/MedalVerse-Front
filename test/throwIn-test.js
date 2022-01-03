var BigNumber = require('bignumber.js');
var chai = require('chai');
var expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));

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
        await this.throwInInstance.setYear(year, { from: owner })
        await this.throwInInstance.changeStatusToRegistrationOfParticipants({ from: owner })

        await this.throwInInstance.addParticipant(name, user, { from: owner });

        // Define the variables to be checked
        let participant = await this.throwInInstance.participantMap(user);

        // check
        console.log("Check la structure du participant ...")
        expect(participant.playerName).to.equal(name);

        console.log("-------------------------------")
        console.log("Nom du participant: " + participant.playerName + " = " + name);
        console.log("-------------------------------")
    })

    // Add Winner -------------------------------
    it("ajout d'un Winner", async function () {
        await this.throwInInstance.setYear(year, { from: owner });
        // Change statut for the next 
        await this.throwInInstance.changeStatusToRegistrationOfParticipants({ from: owner })
        await this.throwInInstance.addParticipant(name, user, { from: owner });

        await this.throwInInstance.changeStatusToCompetitionInProgress({ from: owner });
        await this.throwInInstance.changeStatusToRewardDistribution({ from: owner });

        // Add Winner
        await this.throwInInstance.addWinner(user, { from: owner });

        // Define the variables to be checked   
        let winner = new BigNumber(await this.throwInInstance.winnerMap(user));
        let whatYear = new BigNumber(await this.throwInInstance.getYearOfCompetition());
        let winYear = new BigNumber(await this.throwInInstance.viewThisVictoryByAddress(user, 0));
        

        // Check
        console.log("Check la structure du gagnant ...")
        expect(winYear).to.be.bignumber.equal(whatYear);
        expect(winner).to.be.bignumber.equal(number);

        console.log("-------------------------------")
        console.log("Année de victoire: " + winYear + " = " + whatYear);
        console.log("Nombre de victoire: " + winner + " = " + number);
        console.log("-------------------------------")
    })

    // Remove This Participant -------------------------------
    it("Supprime un participant", async function () {
        await this.throwInInstance.setYear(year, { from: owner })

        await this.throwInInstance.changeStatusToRegistrationOfParticipants({ from: owner })
        // Add participants
        await this.throwInInstance.addParticipant(name, user, { from: owner });
        await this.throwInInstance.addParticipant(name1, accounts[2], { from: owner });
        await this.throwInInstance.addParticipant(name2, accounts[3], { from: owner });

        // Remove participant number 1
        await this.throwInInstance.removeThisParticipant(1, { from: owner });

        // Define the variables to be checked
        participant = await this.throwInInstance.participantMap(accounts[2]);

        // Check
        console.log("Verifie le changement de position du participant numéro 2 ...")
        expect(participant.playerName).to.equal(name1);
        expect(participant.wallet).to.equal(accounts[2]);

        console.log("-------------------------------")
        console.log("Nom du nouveau participant 1: " + participant.playerName + " = " + name1)
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

    
    //Error Test
    it("Mint plusieurs NFT ", async function () {
        console.log("Test des erreur ...")
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name1", "img1");
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(2, { from: owner });
    })

    it("Utilisez une function quand c'est pas le bon status", async function () {
        await this.throwInInstance.addWinner(user, { from: owner });
    })

    it("Utilisez transferFromWithoutPermission sans etre l'owner", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        await this.throwInInstance.setPaused({ from: owner });
        await this.throwInInstance.safeTransferFromWithoutPermission(owner, 1, { from: user });
    })

    it("Mettre pause si on est pas l'owner", async function () {
        await this.throwInInstance.setPaused({ from: user });
    })

    it("Changez de statut si on es pas Owner", async function () {
        await this.throwInInstance.setYear(year, { from: owner })
        await this.throwInInstance.changeStatusToRegistrationOfParticipants({ from: user });
    })

    it("Utilisé une fonction pause quand le contrat n'est pas en pause ", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        await this.throwInInstance.transferFrom(owner, user, 1, { from: owner });

        await this.throwInInstance.safeTransferFromWithoutPermission(user, 1, { from: owner });
    })
    
    it("Utilisé une fonction qui neccesite que le contrat ne soit pas en pause quand le contrat est en pause ", async function () {
        await this.throwInInstance.setPaused({ from: owner });
        await this.throwInInstance.setYear(year, { from: owner })
    })
})