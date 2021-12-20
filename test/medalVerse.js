// const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const MedalVerse = artifacts.require('MedalVerse');
//const truffleAssert = require('truffle-assertions');



contract('MedalVerse', function (accounts) {


  const owner = accounts[0];
  const recipient = accounts[1];


  beforeEach(async function () {
    this.MedalVerseInstance = await MedalVerse.new({ from: owner });
  });

  it("Créé un utilisateur, l'enregistre, lit dans la base le résultat", async function () {
    // add user
    const username = "Paul_Henry"
    const URI = "1.jpeg"
    const mail = "pol@gmail.com"
    const role = 0

    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, role, 0, { from: accounts[0] })

    let details = await this.MedalVerseInstance.getUserDetails(recipient)

    // check
    expect(details.userName === username && details.iconURI === URI && details.email === mail && details.role === role && details.activ == true)
  });
})