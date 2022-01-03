const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));

const NFTArtist = artifacts.require('NFTArtist')
contract('NFTArtist', function (accounts) {

    const owner = accounts[0];
    const user = accounts[1];
    const number = new BigNumber(1);
    const name = "Coupe en or"
    const Uri = "img"

    beforeEach(async function () {
        this.NFTArtistInstance = await NFTArtist.new({ from: owner });

    })
    // Mint --------------
    it("mint D'un NFT Artiste et vérification de ça structure", async function () {
        // Mint NFTArtist
        await this.NFTArtistInstance.mintNFTArtist(name, Uri, { from: user });

        // Define the variables to be checked
        let balance = new BigNumber(await this.NFTArtistInstance.balanceOf(user));

        //Check 

        expect(balance).to.be.bignumber.equal(number)

        console.log("Vérifie la balance apres Mint ...")
        console.log("-------------------------------")
        console.log("balance: " + balance + " = " + number)
        console.log("-------------------------------")

        // Define the variables to be checked
        let NFT = await this.NFTArtistInstance.NFTs(number);

        //Check
        console.log("Vérifie la structure du NFT ...")

        expect(NFT.name).to.equal(name);
        expect(new BigNumber(NFT.tokenId)).to.be.bignumber.equal(number);
        expect(NFT.creator).to.equal(user);
        expect(NFT.imgPath).to.equal(Uri);

        console.log("-------------------------------")
        console.log("Nom du NFT: " + NFT.name + " = " + name)
        console.log("Token Id du NFT: " + NFT.tokenId + " = " + number)
        console.log("Adresse du createur: " + NFT.creator + " = " + user)
        console.log("URI du NFT: " + NFT.imgPath + " = " + Uri)
        console.log("-------------------------------")
    })
})