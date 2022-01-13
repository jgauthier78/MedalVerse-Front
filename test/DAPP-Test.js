const exceptionHandler = require("../scripts/CatchException")
const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-bignumber')(BigNumber));
const MedalVerse = artifacts.require('MedalVerse');
const $Medal = artifacts.require('Medal')
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
  const priceNFTA = new BigNumber(100 * (10 ** 18))
  const priceNFTT = new BigNumber(500 * (10 ** 18))

  const price = new BigNumber(1200);
  const sportCategory = 12;
  const description = "NFT Création";
  // Event
  let orgID = 0
  let startDate = 12354
  let endDate = 14789
  let sport = 4
  let desc = "Fake Desc"

  // init $Medal
  beforeEach(async function () {
    this.tokenInstance = await $Medal.new({ from: owner })
  })

  // init MedalVerse
  beforeEach(async function () {
    let addressToken = this.tokenInstance.address;
    this.MedalVerseInstance = await MedalVerse.new(addressToken, { from: owner });
  });

  // init NFTArtist
  beforeEach(async function () {
    let addressToken = this.tokenInstance.address
    let addressMedalVerse = this.MedalVerseInstance.address
    this.nftArtistInstance = await nftArtist.new(addressToken, addressMedalVerse, { from: owner })
  })

  // init NFTThrowIn
  beforeEach(async function () {
    let addressToken = this.tokenInstance.address
    let addressMedalVerse = this.MedalVerseInstance.address
    let addressNftArtist = this.nftArtistInstance.address
    this.throwInInstance = await throwIn.new("Running Cup", addressNftArtist, addressToken, addressMedalVerse, "Running Nft", "RuNFT", true, { from: owner });
  })



  // USER -------------------------------
  it("A-Créé un USER, l'enregistre, vérifie l'état de la base", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, role, { from: owner });
    let details = await this.MedalVerseInstance.getUserDetails(recipient);

    // check
    expect(details.userName).to.equal(username);
    expect(details.iconURI).to.equal(URI);
    expect(details.email).to.equal(mail);
    expect(new BigNumber(details.role)).to.be.bignumber.equal(role);
    expect(details.activ).to.equal(true);
  });

  it("B-not Owner Créé un USER doit échouer", async function () {
    await catchException(this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, role, { from: recipient }), errTypes.revert)

  });

  it("C-Créé un USER, SPORTIF et vérifie qu'il est bien enregistré en sportif", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, SPORTSMAN_ROLE, { from: owner });
    let details = await this.MedalVerseInstance.getSportsmanList(0, 0, { from: owner });

    // check
    expect(details[0].userAddress).to.equal(recipient);
  });

  it("D-Créé un USER, ORGANIZER et vérifie qu'il est bien enregistré en Organizer", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });
    let details = await this.MedalVerseInstance.getOrganizerAddressById(0);

    // check
    expect(details).to.equal(recipient);

  });

  it("E-Créé un user de type AUTHOR, vérifie la bonne écriture dans le contrat", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, { from: owner });
    let details = await this.MedalVerseInstance.getAuthor(recipient);
    // check
    expect(details.userAddress).to.equal(recipient);
    expect(details.activ).to.equal(true);
  });


  it("F-Essai de lire une liste de sportifs en dehors de la plage disponible ", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, SPORTSMAN_ROLE, { from: owner });
    await catchException(this.MedalVerseInstance.getSportsmanList(1, 1, { from: owner }), errTypes.revert);

  });


  it("G-Vérifie qu'un user non author retourne une structure auteur nulle", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 0, { from: owner });
    let details = await this.MedalVerseInstance.getAuthor(recipient);
    // check
    expect(details.activ).to.equal(false);
  });


  it("H-Essai de lire un organizer en dehors de la plage disponible ", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });
    await catchException(this.MedalVerseInstance.getOrganizerAddressById(5, { from: owner }), errTypes.revert);

  });

  // Author----------------------------

  it("I-Ajoute une Creation à un author, vérifie la bonne écriture dans la liste des créations", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, { from: owner });
    await this.MedalVerseInstance.addCreation(recipient, price, description, URI, { from: owner });

    let details = await this.MedalVerseInstance.getCreationList(0, 0);
    // check
    expect(new BigNumber(details[0].price)).to.be.bignumber.equal(price);
    expect(details[0].URI).to.equal(URI);
    expect(details[0].author).to.equal(recipient);
  });


  it("J-Créé une Creation, vérifie le lien avec AUTHOR", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, { from: accounts[0] });
    await this.MedalVerseInstance.addCreation(recipient, price, description, URI, { from: owner });

    let details = await this.MedalVerseInstance.getAuthorCreationsList(recipient);
    creationIndx = new BigNumber(details[0])
    // check
    expect(creationIndx).to.be.bignumber.equal(0);
  });

  it("K-Affect un NFT à une création, vérifie le lien", async function () {
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, 2, { from: accounts[0] });
    await this.MedalVerseInstance.addCreation(recipient, price, description, URI, { from: owner });
    await this.MedalVerseInstance.affectNFTtoCreation(0, owner, { from: accounts[0] });
    // check
    let details = await this.MedalVerseInstance.getCreationList(0, 0);
    expect(details[0].NFT_Bkg_Adr).to.equal(owner);
  });

  it("L-Ajoute une Creation à un author qui n'en est pas un", async function () {

    await catchException(this.MedalVerseInstance.addCreation(recipient, price, description, URI, { from: owner }), errTypes.revert)

  });
  it("M-Essaie d'accéder à une création d'un auteur qui n'existe pas", async function () {

    await catchException(this.MedalVerseInstance.getAuthorCreationsList(recipient), errTypes.revert)
  });
  it("N-Récupère liste de créations en dehors des ranges corrects", async function () {

    await catchException(this.MedalVerseInstance.getCreationList(3, 4), errTypes.revert)
    await catchException(this.MedalVerseInstance.getCreationList(0, 0), errTypes.revert)
    await catchException(this.MedalVerseInstance.getCreationList(4, 3), errTypes.revert)
  });


  // Event-------------------------------


  it("O-Ajoute un événement sur une organization valide", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    let indx = await this.MedalVerseInstance.getEventList(0)

    expect(indx[0]).to.be.equal("1")
  })

  it("P-Démarre un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    let evnt = await this.MedalVerseInstance.getEvent(1)

    expect(evnt.eventState).to.be.equal("1")
  })
  it("Q-Arrete un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    let evnt = await this.MedalVerseInstance.getEvent(1)

    expect(evnt.eventState).to.be.equal("2")
  })


  it("R-Définit un Winner à un événement", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })
    let winner = await this.MedalVerseInstance.eventGetWinner(1)

    expect(winner).to.be.equal(recipient)
  })


  it("S-Ajoute une médaille  à un événement", async function () {

    // créé une médaille
    await this.tokenInstance.approve(this.nftArtistInstance.address, priceNFTA, { from: owner })
    await this.tokenInstance.approve(this.throwInInstance.address, priceNFTT, { from: owner })
    await this.nftArtistInstance.mintNFTArtist("Athus Keller", "/img/medals/medal0.jpg", { from: owner })
    await this.throwInInstance.mintCup(1, { from: owner });
    await this.throwInInstance.setYear(2022, { from: owner })
    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })

    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })

    await this.MedalVerseInstance.adminAddMedal(1, this.throwInInstance.address, { from: recipient })

    let md = await this.MedalVerseInstance.getMedal(await this.MedalVerseInstance.eventGetMedal(1))

    expect(md.throwIn).to.be.equal(this.throwInInstance.address)
  })
  it("T-Publie une médaille", async function () {
    await this.tokenInstance.approve(this.nftArtistInstance.address, priceNFTA, { from: owner })
    await this.tokenInstance.approve(this.throwInInstance.address, priceNFTT, { from: owner })
    await this.nftArtistInstance.mintNFTArtist("Athus Keller", "/img/medals/medal0.jpg", { from: owner })
    await this.throwInInstance.mintCup(1, { from: owner });
    await this.throwInInstance.setYear(2022, { from: owner })
    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })

    await this.MedalVerseInstance.adminAddMedal(1, this.throwInInstance.address, { from: recipient })
    await this.MedalVerseInstance.adminGiveMedalToWinner(1, { from: recipient })
    let indx = await this.MedalVerseInstance.eventGetMedal(1)
    await this.MedalVerseInstance.publishMedal(indx, true, { from: recipient })
    let md = await this.MedalVerseInstance.getMedal(indx)

    expect(md.isInWinnerGallery).to.be.equal(true)
  })
  it("U-Ajoute un événement et vérifie l'écriture dans le contrat MedalVerse", async function () {
    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, desc, { from: recipient })
    let evtDesc = await this.MedalVerseInstance.getEvent(1)
    let evtCount = new BigNumber(await this.MedalVerseInstance.getEventCount())

    expect(evtCount).to.be.bignumber.equal(1)
    expect(evtDesc.organizedBy).to.be.bignumber.equal(orgID)
    expect(evtDesc.startDate).to.be.bignumber.equal(startDate)
    expect(evtDesc.endDate).to.be.bignumber.equal(endDate)
    expect(evtDesc.eventDescription).to.be.equal(desc)
  })

  it("V-Ajoute un événement sur une organization invalide", async function () {

    await catchException(this.MedalVerseInstance.newEvent(new BigNumber(0), new BigNumber(startDate), new BigNumber(endDate), desc, { from: owner }), errTypes.revert)
  })
  it("W-Essai d'accéder à un événement qui n'existe pas, ou id invalide", async function () {
    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });

    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    // on attend un revert
    await catchException(this.MedalVerseInstance.getEvent(0, { from: owner }), errTypes.revert);

  })
  it("X-démarre/stop un événement invalide", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });
    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });
    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })


    await catchException(this.MedalVerseInstance.adminStartEvent(2, { from: recipient }), errTypes.revert);
    await catchException(this.MedalVerseInstance.adminEndEvent(2, { from: recipient }), errTypes.revert);

  })
  it("Y-démarre/stoppe un événement dont on est pas l'admin", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });
    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });
    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })


    await catchException(this.MedalVerseInstance.adminStartEvent(1, { from: owner }), errTypes.revert);
    await catchException(this.MedalVerseInstance.adminEndEvent(1, { from: owner }), errTypes.revert);
  })

  it("Z-Ajoute une médaille sans déclarer de gagnant", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });
    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville de Lyons", { from: recipient })


    await catchException(this.MedalVerseInstance.adminAddMedal(1, accounts[2], { from: recipient }), errTypes.revert)
  })

  it("ZA-Ajoute une médaille sans être admin", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, {
      from:
        owner
    });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });
    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminSetWinner(1, recipient, { from: recipient })

    //owner n'est pas l'admin, une exception doit être générée
    await catchException(this.MedalVerseInstance.adminAddMedal(1, accounts[2], { from: owner }), errTypes.revert)
  })

  it("ZB-Déclare vainqueur sans être admin", async function () {

    // créé un organizateur
    await this.MedalVerseInstance.addNewUser(recipient, URI, username, mail, ORGANIZER_ROLE, { from: owner });

    // créé une organization
    await this.MedalVerseInstance.addOrganization(recipient, "FFA", "Fédération Française d'Athlétisme", "running.jpg", { from: owner });
    await this.MedalVerseInstance.newEvent(0, startDate, endDate, "Saison 14, ville deLyons", { from: recipient })
    await this.MedalVerseInstance.adminStartEvent(1, { from: recipient })
    await this.MedalVerseInstance.adminEndEvent(1, { from: recipient })
    // owner n'est pas admin
    await catchException(this.MedalVerseInstance.adminSetWinner(1, recipient, { from: owner }), errTypes.revert)
  })

  it("ZC-Withdraw les tokens placés dans le contrat", async function () {
    await this.tokenInstance.approve(this.nftArtistInstance.address, priceNFTA, { from: owner })
    await this.tokenInstance.approve(this.throwInInstance.address, priceNFTT, { from: owner })
    await this.nftArtistInstance.mintNFTArtist("Athus Keller", "/img/medals/medal0.jpg", { from: owner })
    await this.throwInInstance.mintCup(1, { from: owner });

    let balance = new BigNumber(await this.tokenInstance.balanceOf(this.MedalVerseInstance.address))

    let priceTotal = new BigNumber(600 * (10 ** 18))

    expect(balance).to.be.bignumber.equal(priceTotal)

    await this.MedalVerseInstance.withdraw({ from: owner })

    balance = new BigNumber(await this.tokenInstance.balanceOf(this.MedalVerseInstance.address))

    expect(balance).to.be.bignumber.equal(new BigNumber(0))

  })
  it("ZD-Withdraw les tokens placés dans le contrat lorsqu'il est vide", async function () {

    let balance = new BigNumber(await this.tokenInstance.balanceOf(this.MedalVerseInstance.address))

    let priceTotal = new BigNumber(new BigNumber(0))

    expect(balance).to.be.bignumber.equal(priceTotal)

    await catchException(this.MedalVerseInstance.withdraw({ from: owner }), errTypes.revert)


  })

})