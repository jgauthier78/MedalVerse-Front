const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));
const exceptionHandler = require("../scripts/CatchException")

const errTypes = exceptionHandler.errTypes
const catchException = exceptionHandler.catchException
const $Medal = artifacts.require('Medal')

contract('Medal', async function (accounts) {

    const owner = accounts[0]
    const user = accounts[1]
    const supplyMax = new BigNumber(20 * (10 ** 25))
    const burnedMax = new BigNumber(10 * (10 ** 25))
    const tokenBurn = new BigNumber(100)
    const ErrTokenBurn = new BigNumber(1000000000000000000000000018)
    const tokenTransfer = new BigNumber(10 ** 18)

    beforeEach(async function () {
        this.tokenInstance = await $Medal.new({ from: owner });
    })

    it("A-verification de la supply", async function () {

        let balance = new BigNumber(await this.tokenInstance.balanceOf(owner))

        expect(balance).to.be.bignumber.equal(supplyMax)
    })
    
    it("B-Burn de token", async function () {
        await this.tokenInstance.burn(tokenBurn, { from: owner })

        let Tkburn = new BigNumber(await this.tokenInstance.getTokenBurned())

        expect(Tkburn).to.be.bignumber.equal(tokenBurn)
    })

    it("C-Burn un montant de token trop grand", async function () {
        await catchException(this.tokenInstance.burn(ErrTokenBurn, { from: owner }), errTypes.revert)

        let Tkburn = new BigNumber(await this.tokenInstance.getTokenBurned())

        expect(Tkburn).to.be.bignumber.equal(new BigNumber(0))
    })

    it("D-Burn de token quand on n'est pas owner", async function () {
        await this.tokenInstance.transfer(user, tokenTransfer, { from: owner })
        let balanceUser = new BigNumber(await this.tokenInstance.balanceOf(user))
        expect(balanceUser).to.be.bignumber.equal(tokenTransfer)

        await catchException(this.tokenInstance.burn(tokenTransfer, { from: user }), errTypes.revert)

        let Tkburn = new BigNumber(await this.tokenInstance.getTokenBurned())

        expect(Tkburn).to.be.bignumber.equal(new BigNumber(0))
    })

})

