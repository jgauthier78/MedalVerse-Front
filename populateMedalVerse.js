var MedalVerse = artifacts.require("./MedalVerse.sol");

module.exports = async function (callback) {

    let accounts = await web3.eth.getAccounts()
    MedalVerse.addUser(accounts[0], "A.jpeg", "PaulP", "pol@gmail.com", 0, { from: accounts[0] })
}