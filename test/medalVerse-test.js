const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));



const MedalVerse = artifacts.require('MedalVerse');




contract('MedalVerse', function (accounts) {


  const owner = accounts[0];
  const recipient = accounts[1];

  const username = "Paul_Henry";
  const URI = "1.jpeg";
  const mail = "pol@gmail.com";
  const role = new BigNumber(0);

  const price = new BigNumber(1200);
  const sportCategory = 12;
  const description = "NFT Création";


  beforeEach(async function () {
    this.MedalVerseInstance = await MedalVerse.new({ from: owner });
  });

  // USER -------------------------------
  it("Créé un USER, l'enregistre, lit dans la base le résultat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, role, 0, { from: accounts[0] });
    let details = await this.MedalVerseInstance.getUserDetails(recipient);

    // check
    expect(details.userName).to.equal(username);
    expect(details.iconURI).to.equal(URI);
    expect(details.email).to.equal(mail);
    expect(new BigNumber(details.role)).to.be.bignumber.equal(role);
    expect(details.activ).to.equal(true);
  });


  // Author-------------------------------

  it("Créé un user de type AUTHOR, vérifie la bonne écriture dans le contrat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: owner });
    let details = await this.MedalVerseInstance.getAuthor(recipient);
    // check
    expect(details.userAddress).to.equal(recipient);
    expect(details.activ).to.equal(true);
  });

  it("Vérifie qu'un user non author retourne une structure nulle", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 0, 0, { from: owner });
    let details = await this.MedalVerseInstance.getAuthor(recipient);
    // check
    expect(details.activ).to.equal(false);
  });


  it("Ajoute une Creation à un author, vérifie la bonne écriture dans la liste des créations", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: owner });
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner });

    let details = await this.MedalVerseInstance.getCreationList(0, 0);
    // check
    expect(new BigNumber(details[0].price)).to.be.bignumber.equal(price);
    expect(details[0].URI).to.equal(URI);
    expect(details[0].author).to.equal(recipient);
  });


  it("Créé une Creation, vérifie le lien avec AUTHOR", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] });
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner });

    let details = await this.MedalVerseInstance.getAuthorCreationsList(recipient);
    creationIndx = new BigNumber(details[0])
    // check
    expect(creationIndx).to.be.bignumber.equal(0);
  });

  it("Affect un NFT à une création, vérifie le lien", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] });
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner });
    await this.MedalVerseInstance.affectNFTtoCreation(0, owner, { from: accounts[0] });
    // check
    let details = await this.MedalVerseInstance.getCreationList(0, 0);
    expect(details[0].NFT_Bkg_Adr).to.equal(owner);
  });

  it("Affect un NFT à une création, vérifie le lien", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, 0, { from: accounts[0] });
    await this.MedalVerseInstance.addCreation(recipient, price, sportCategory, description, URI, { from: owner });
    await this.MedalVerseInstance.affectNFTtoCreation(0, owner, { from: accounts[0] });

    let details = await this.MedalVerseInstance.getCreationList(0, 0);
    // check
    expect(details[0].NFT_Bkg_Adr).to.equal(owner);
  });

})