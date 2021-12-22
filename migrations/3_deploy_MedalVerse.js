var MedalVerse = artifacts.require("./MedalVerse.sol");

module.exports = async function (deployer) {
  await deployer.deploy(MedalVerse);

  let accounts = await web3.eth.getAccounts()
  let MVerse = await MedalVerse.deployed()

  console.log("MedalVerse Deployed ------------")
  console.log("Populating with Users")

  console.log(accounts[1])
  console.log(accounts[0])
  MVerse.addNewUser(accounts[1], "1.jpeg", "Paul_Henry", "pol@gmail.com", 12, 0, { from: accounts[0] })
  MVerse.addNewUser(accounts[0], "2.jpeg", "François Coste", "fcoste@gmail.com", 8, 0, { from: accounts[0] })
  await MVerse.addOrganization(accounts[1], "FFA", "Fédération Française d'Athlétisme", "A.jpg", { from: accounts[0] });
  await MVerse.addOrganization(accounts[1], "FFE", "Fédération Française d'Escrime", "B.jpg", { from: accounts[0] });
  await MVerse.organizationAddAdmin(0, accounts[1]);
  /*try { v = await MVerse.getAdminList(0) }
  catch (err) { console.log(err) }
    v = await MVerse.getOrganizerAddressById(v[0]);
    console.log("orgs: " + v)
  
    v = await MVerse.getOrganizerOrganisationList(accounts[0]) 
    console.log("list of orgs " + v)
  */
};
