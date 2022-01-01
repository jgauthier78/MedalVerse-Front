const { BN } = require('@openzeppelin/test-helpers');
const expect = require('chai').expect;

const NFTArtist = artifacts.require('NFTArtist')
contract('NFTArtist', function (accounts) {

    const owner = accounts[0];
    const user = accounts[1];
    const number = new BN(1);
    const name = "Coupe en or"
    const Uri = "img"

    beforeEach(async function () {
        this.NFTArtistInstance = await NFTArtist.new({from: owner});

    })
    // Mint --------------
    it("mint D'un NFT Artiste et vérification de ça structure", async function () {
        // Mint NFTArtist
        await this.NFTArtistInstance.mintNFTArtist(name, Uri, {from: user});

        // Define the variables to be checked
        let balance = new BN(await this.NFTArtistInstance.balanceOf(user)); 

        //Check 
        expect(balance).to.be.bignumber.equal(number)

        // Define the variables to be checked
        let NFT = await this.NFTArtistInstance.NFTByOwner(user, number);

        //Check
        expect(NFT.name).to.equal(name);
        expect(new BN(NFT.tokenId)).to.be.bignumber.equal(number);
        expect(NFT.creator).to.equal(user);
        expect(NFT.imgPath).to.equal(Uri);
    })
})