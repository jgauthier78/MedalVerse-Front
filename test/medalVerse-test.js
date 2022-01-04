const exceptionHandler = require("../scripts/CatchException")
const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));
const MedalVerse = artifacts.require('MedalVerse');
const throwIn = artifacts.require('ThrowIn');
const nftArtist = artifacts.require('NFTArtist');




const SPORTSMAN_ROLE = 8
const AUTHOR_ROLE = 2
const ORGANIZER_ROLE = 4


const errTypes = exceptionHandler.errTypes
const catchException = exceptionHandler.catchException



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
  // Event
  let orgID = 14
  let startDate = 12354
  let endDate = 14789
  let sport = 4
  let desc = "Fake Desc"

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


  it("Créé un USER, SPORTIF et vérifie qu'il est bien enregistré en sportif", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, SPORTSMAN_ROLE, sport, { from: owner });
    let details = await this.MedalVerseInstance.getSportsmanList(0, 0, { from: owner });

    // check
    expect(details[0].userAddress).to.equal(recipient);
    expect(details[0].sportCategory).to.equal("4");
  });


  it("Essai de lire une liste de sportifs en dehors de la plage disponible ", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, SPORTSMAN_ROLE, sport, { from: owner });
    await catchException(this.MedalVerseInstance.getSportsmanList(1, 1, { from: owner }), errTypes.revert);

  });

  it("Créé un USER, ORGANIZER et vérifie qu'il est bien enregistré en sportif", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });
    let details = await this.MedalVerseInstance.getOrganizerAddressById(0);

    // check
    expect(details).to.equal(recipient);

  });



  // Author-------------------------------

  console.log(' Author-------------------------------')
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



  // Event-------------------------------

  console.log(' Event-------------------------------')
  it("Ajoute un événement sur une organization invalide", async function () {

    await catchException(this.MedalVerseInstance.newEvent(new BigNumber(0), new BigNumber(startDate), new BigNumber(endDate), new BigNumber(sport), desc, { from: owner }), errTypes.revert)
  })

  it("Ajoute un événement sur une organization valide", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })
    let indx = await this.MedalVerseInstance.getEventList(0)

    expect(indx[0]).to.be.equal("1")
  })

  it("Démarre un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    let evnt = await this.MedalVerseInstance.getEvent(1)

    expect(evnt.started).to.be.equal(true)
  })
  it("Arrete un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    let evnt = await this.MedalVerseInstance.getEvent(1)

    expect(evnt.ended).to.be.equal(true)
  })


  it("Définit un Winner à un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })
    let winner = await this.MedalVerseInstance.eventGetWinner(1)

    expect(winner).to.be.equal(recipient)
  })

  it("Ajoute une médaille à un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })

    await this.MedalVerseInstance.adminAddMedal(1, accounts[2], { from: recipient })

    let md = await this.MedalVerseInstance.getMedal(await this.MedalVerseInstance.eventGetMedal(1))

    expect(md.throwIn).to.be.equal(accounts[2])
  })
  it("Publie une médaille", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, sport, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, 2, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })

    await this.MedalVerseInstance.adminAddMedal(1, accounts[2], { from: recipient })

    let indx = await this.MedalVerseInstance.eventGetMedal(1)
    await this.MedalVerseInstance.publishMedal(indx, true, { from: recipient })
    let md = await this.MedalVerseInstance.getMedal(indx)

    expect(md.isInWinnerGallery).to.be.equal(true)
  })
  it("Ajoute un événement et vérifie l'écriture dans le contrat MedalVerse", async function () {

    await this.MedalVerseInstance.addEvent(new BigNumber(orgID), new BigNumber(startDate), new BigNumber(endDate), new BigNumber(sport), desc, { from: owner })
    let evtDesc = await this.MedalVerseInstance.getEvent(1)
    let evtCount = new BigNumber(await this.MedalVerseInstance.getEventCount())

    expect(evtCount).to.be.bignumber.equal(1)
    expect(evtDesc.sportCategory).to.be.bignumber.equal(sport)
    expect(evtDesc.organizedBy).to.be.bignumber.equal(orgID)
    expect(evtDesc.startDate).to.be.bignumber.equal(startDate)
    expect(evtDesc.endDate).to.be.bignumber.equal(endDate)
    expect(evtDesc.eventDescription).to.be.equal(desc)
  })
  it("Essai d'accéder à un événement qui n'existe pas, ou id invalide", async function () {

    await this.MedalVerseInstance.addEvent(new BigNumber(orgID), new BigNumber(startDate), new BigNumber(endDate), new BigNumber(sport), desc, { from: owner })

    // on attend un revert
    await catchException(this.MedalVerseInstance.getEvent(0, { from: owner }), errTypes.revert);
    let indx = await this.MedalVerseInstance.getEvent(10, { from: owner })

    // check
    expect(indx.activ).to.be.equal(false);
  })





})