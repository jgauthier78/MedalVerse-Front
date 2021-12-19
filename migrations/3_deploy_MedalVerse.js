var MedalVerse = artifacts.require("./MedalVerse.sol");

module.exports = async function (deployer) {
  await deployer.deploy(MedalVerse);

  let accounts = await web3.eth.getAccounts()
  let MVerse = await MedalVerse.deployed()

  console.log("MedalVerse Deployed ------------")
  console.log("Populating with Users")
  await MVerse.addUser(accounts[1], "A.jpeg", "PaulP", "pol@gmail.com", 0, { from: accounts[0] })


};
