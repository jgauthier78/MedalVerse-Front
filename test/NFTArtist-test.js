const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));
const exceptionHandler = require("../scripts/CatchException")

const NFTArtist = artifacts.require('NFTArtist')
const $Medal = artifacts.require('Medal')
const medalVerse = artifacts.require('MedalVerse')
const errTypes = exceptionHandler.errTypes
const catchException = exceptionHandler.catchException
contract('NFTArtist', function (accounts) {

    const owner = accounts[0];
    const user = accounts[1];
    const number = new BigNumber(1);
    const name = "Coupe en or"
    const Uri = "img"
    const price = new BigNumber(100 * (10 ** 18))
    const newPrice = new BigNumber(20 * (10 ** 18))

    // init $Medal
    beforeEach(async function () {
        this.tokenInstance = await $Medal.new({ from: owner });
    })

    // init MedalVerse
    beforeEach(async function () {
        let addressToken = await this.tokenInstance.address
        this.medalVerseInstance = await medalVerse.new(addressToken, { from: owner });
    })

    beforeEach(async function () {
        let addressToken = await this.tokenInstance.address
        this.medalVerseInstance2 = await medalVerse.new(addressToken, { from: owner });
    })

    // Init NFTArtist
    beforeEach(async function () {    
        let addressToken = await this.tokenInstance.address
        let addressMedalVerse = await this.medalVerseInstance.address    
        this.nftArtistInstance = await NFTArtist.new(addressToken, addressMedalVerse, { from: owner });
    })
    // Mint --------------
    it("A-mint D'un NFT Artiste et vérification de ça structure", async function () {
        this.tokenInstance.approve(this.nftArtistInstance.address, price, { from: owner })
        // Mint NFTArtist
        await this.nftArtistInstance.mintNFTArtist(name, Uri, { from: owner });

        // Define the variables to be checked
        let balance = new BigNumber(await this.nftArtistInstance.balanceOf(owner));

        //Check 
        expect(balance).to.be.bignumber.equal(number)
        // Vérifie la balance apres Mint
        // balance: balance = number

        // Define the variables to be checked
        let NFT = await this.nftArtistInstance.NFTs(number);

        //Check
        console.log("Vérifie la structure du NFT ...")

        expect(NFT.name).to.equal(name);
        expect(new BigNumber(NFT.tokenId)).to.be.bignumber.equal(number);
        expect(NFT.creator).to.equal(owner);
        expect(NFT.imgPath).to.equal(Uri);
        // Nom du NFT: NFT.name = name
        // Token Id du NFT: NFT.tokenId = number
        // Adresse du createur: NFT.creator = owner
        // URI du NFT: NFT.imgPath = Uri

    })

    it("B-changer le prix de mint", async function () { 
        await this.nftArtistInstance.changePrice(newPrice, { from: owner })

        let checkPrice = await this.nftArtistInstance.checkPrice();

        expect(new BigNumber(checkPrice)).to.be.bignumber.equal(newPrice)   
    })

    it("C-changer l'addresse du contrat MedalVerse", async function () {

        await this.nftArtistInstance.setAddressMedalVerse(this.medalVerseInstance2.address, { from: owner })

        let addressMedalVerse = await this.nftArtistInstance.checkAddressMedalVerse()

        expect(addressMedalVerse).to.equal(this.medalVerseInstance2.address);

    })

    it("D-Changer le prix de mint si on n'est pas l'owner", async function () {
        await catchException(this.nftArtistInstance.changePrice(newPrice, { from: user }), errTypes.revert)

        let checkPrice = new BigNumber(await this.nftArtistInstance.checkPrice())

        expect(checkPrice).to.be.bignumber.equal(price)
    })

    it("E-Changer l'addresse MedalVerse si on est owner", async function () {
        await catchException(this.nftArtistInstance.setAddressMedalVerse(this.medalVerseInstance2.address, { from: user }), errTypes.revert)

        let addressMedalVerse = await this.nftArtistInstance.checkAddressMedalVerse()

        expect(addressMedalVerse).to.equal(this.medalVerseInstance.address)
    })
})