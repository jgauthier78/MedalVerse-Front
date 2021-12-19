var MedalVerse = artifacts.require("./MedalVerse.sol");

module.exports = async function (deployer) {
  await deployer.deploy(MedalVerse);

  let accounts = await web3.eth.getAccounts()
  let MVerse = await MedalVerse.deployed()

  console.log("MedalVerse Deployed ------------")
  console.log("Populating with Users")

  MVerse.addNewUser(accounts[1], "1.jpeg", "Paul_Henry", "pol@gmail.com", 12, 0, { from: accounts[0] })




};
