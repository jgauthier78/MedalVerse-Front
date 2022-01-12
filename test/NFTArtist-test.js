const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));

const NFTArtist = artifacts.require('NFTArtist')
const $Medal = artifacts.require('Medal')
const medalVerse = artifacts.require('MedalVerse')
contract('NFTArtist', function (accounts) {

    const owner = accounts[0];
    const user = accounts[1];
    const number = new BigNumber(1);
    const name = "Coupe en or"
    const Uri = "img"
    const price = new BigNumber(100 * (10 ** 18))

    // init $Medal
    beforeEach(async function () {
        this.tokenInstance = await $Medal.new({ from: owner });
    })

    // init MedalVerse
    beforeEach(async function () {
        let addressToken = await this.tokenInstance.address
        this.medalVerseInstance = await medalVerse.new(addressToken, { from: owner });
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
})