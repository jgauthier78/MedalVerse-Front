var BigNumber = require('bignumber.js');
var chai = require('chai');
var expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));
const exceptionHandler = require("../scripts/CatchException")

const errTypes = exceptionHandler.errTypes
const catchException = exceptionHandler.catchException

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

    // MINT 
    it("A-Mint du NFT Coupe", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri, { from: user });

        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        // Define the variables to be checked
        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner));
        let UriToken = await this.throwInInstance.uriToken(1)

        // Check la balance et l'Uri 
        expect(balance).to.be.bignumber.equal(number);
        expect(UriToken).to.equal(Uri);
        // balance: balance = number 
        // Uri du token: UriToken = Uri
    })


    // Add Winner 
    it("B-ajout d'un Winner", async function () {
        await this.throwInInstance.setYear(year, { from: owner });

        // Add Winner
        await this.throwInInstance.addWinner(name, user, { from: owner });

        // Define the variables to be checked   
        let winner = await this.throwInInstance.winnerMap(user);
        let whatYear = new BigNumber(await this.throwInInstance.getYearOfCompetition());
        let winYear = new BigNumber(await this.throwInInstance.viewThisVictoryByAddress(user, 0));
        
        // Check la structure du gagnant
        expect(winner.playerName).to.equal(name);
        expect(winYear).to.be.bignumber.equal(whatYear);
        expect(new BigNumber(winner.numberOfVictory)).to.be.bignumber.equal(number);
        // Nom du gagnant: winner.playerName = name 
        // Année de victoire:  winYear = whatYear
        // Nombre de victoire: winner =  number
        
    })

    // Change Statut and test function statut paused
    it("C-mettre le contract en pause et verifié les fonction de pause ", async function () {
        // Mint
        await this.NFTArtist.mintNFTArtist("name", Uri);
        await this.throwInInstance.mintCup(1, { from: owner });
        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(number);
        // Vérification de la balance: balance = number

        // Send NFT
        await this.throwInInstance.transferFrom(owner, user, 1, { from: owner });
        balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check
        expect(balance).to.be.bignumber.equal(zero);
        // Vérification de la balance aprés l'envoie: balance = zero)

        // Set paused
        await this.throwInInstance.setPaused({ from: owner });
        let paused = await this.throwInInstance.paused();

        // Check
        expect(paused).to.equal(true);
        // Vérifie la mise en pause du contrat: paused = true

        // NFT recovery
        await this.throwInInstance.safeTransferFromWithoutPermission(user, 1, { from: owner });
        balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        // Check 
        expect(balance).to.be.bignumber.equal(number);
        // Vérifie la balance apres la recuperation du NFT: balance = number

        // Remove paused
        await this.throwInInstance.removePaused();
        let unpaused = await this.throwInInstance.paused();

        // Check 
        expect(unpaused).to.equal(false);
        // Verifie que pause a étais enlever: unpaused = false
        
    })

    //Error Test
    it("D-Mint plusieurs NFT ", async function () {
        console.log("Test des erreur ...")
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri, { from: user });
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name1", "img1", { from: user });
        // Mint NftCup with Uri NftArtist 
        await catchException(this.throwInInstance.mintCup(2, { from: owner }), errTypes.revert)

        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner));

        expect(balance).to.be.bignumber.equal(number);
    })

    it("E-Utiliser transferFromWithoutPermission sans etre l'owner", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        await this.throwInInstance.setPaused({ from: owner });
        await catchException(this.throwInInstance.safeTransferFromWithoutPermission(owner, 1, { from: user }), errTypes.revert );

        let balance = new BigNumber(await this.throwInInstance.balanceOf(user))

        expect(balance).to.be.bignumber.equal(zero);
    })

    it("F-Mettre pause si on est pas l'owner", async function () {
        await catchException(this.throwInInstance.setPaused({ from: user }), errTypes.revert);

        let pause = await this.throwInInstance.paused()

        expect(pause).to.equal(false)
    })

    it("G-Utiliser une fonction qui neccesite que le contrat soit en pause quand le contrat n'est pas en pause ", async function () {
        // Mint NftArtiste 
        await this.NFTArtist.mintNFTArtist("name", Uri);
        // Mint NftCup with Uri NftArtist 
        await this.throwInInstance.mintCup(1, { from: owner });

        await this.throwInInstance.transferFrom(owner, user, 1, { from: owner });

        await catchException(this.throwInInstance.safeTransferFromWithoutPermission(user, 1, { from: owner }), errTypes.revert);

        let balance = new BigNumber(await this.throwInInstance.balanceOf(owner))
        let balance1 = new BigNumber(await this.throwInInstance.balanceOf(user))

        expect(balance).to.be.bignumber.equal(zero);
        expect(balance1).to.be.bignumber.equal(number);
    })
    
    it("H-Utiliser une fonction qui neccesite que le contrat ne soit pas en pause quand le contrat est en pause ", async function () {
        await this.throwInInstance.setPaused({ from: owner });
        await catchException(this.throwInInstance.setYear(year, { from: owner }), errTypes.revert)

        let whatYear = new BigNumber(await this.throwInInstance.getYearOfCompetition())

        expect(whatYear).to.be.bignumber.equal(zero);
    })
})