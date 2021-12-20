const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));


const MedalVerse = artifacts.require('MedalVerse');




contract('MedalVerse', function (accounts) {


  const owner = accounts[0];
  const recipient = accounts[1];

  const username = "Paul_Henry"
  const URI = "1.jpeg"
  const mail = "pol@gmail.com"
  const role = 0

  const price = 1200
  const sportCategory = 12
  const description = "NFT Création"


  beforeEach(async function () {
    this.MedalVerseInstance = await MedalVerse.new({ from: owner });
  });

  // USER -------------------------------
  it("Créé un USER, l'enregistre, lit dans la base le résultat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, role, 0, { from: accounts[0] })
    let details = await this.MedalVerseInstance.getUserDetails(recipient)

    // check
    expect(details.userName === username && details.iconURI === URI && details.email === mail && details.role === role && details.activ == true)
  });


  // Author-------------------------------

  it("Créé un user de type AUTHOR, vérifie la bonne écriture dans le contrat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] })
    let details = await this.MedalVerseInstance.getAuthor(recipient)
    // check
    expect(details.userAddress === recipient && details.activ == true)
  });

  it("Créé une Creation, vérifie la bonne écriture dans le contrat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] })
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner })

    let details = await this.MedalVerseInstance.getCreationList(0, 0)
    // check
    expect(details.price === price && details.URI == URI && details.author == recipient)
  });


  it("Créé une Creation, vérifie le lien avec AUTHOR", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] })
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner })

    let details = await this.MedalVerseInstance.getAuthorCreationsList(recipient)

    // check
    expect(details[0]).to.be.bignumber.equal(new BigNumber(0))
  });

  it("Affect un NFT à une création, vérifie le lien", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] })
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner })
    await this.MedalVerseInstance.affectNFTtoCreation(0, owner, { from: accounts[0] })

    let details = await this.MedalVerseInstance.getCreationList(0, 0)
    // check
    expect(details.NFT_Bkg_Adr === owner)
  });

  it("Affect un NFT à une création, vérifie le lien", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] })
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner })
    await this.MedalVerseInstance.affectNFTtoCreation(0, owner, { from: accounts[0] })

    let details = await this.MedalVerseInstance.getCreationList(0, 0)
    // check
    expect(details.NFT_Bkg_Adr === owner)
  });

})