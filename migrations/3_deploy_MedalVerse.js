var MedalVerse = artifacts.require("./MedalVerse.sol");
const TokenMedal = artifacts.require("./Medal.sol");
const throwIn = artifacts.require('ThrowIn');
const nftArtist = artifacts.require('NFTArtist');

const ethers = require('ethers');
const crypto = require('crypto');
const { cp } = require('fs');

module.exports = async function (deployer, network, accounts) {

  //let accounts = await web3.eth.getAccounts()

  const ACCOUNT_CONTRACT_OWNER = accounts[0]

  await deployer.deploy(TokenMedal, { from: ACCOUNT_CONTRACT_OWNER });
  let TkMedal = await TokenMedal.deployed()

  await deployer.deploy(MedalVerse, TkMedal.address, { from: ACCOUNT_CONTRACT_OWNER });
  let MVerse = await MedalVerse.deployed()

  await deployer.deploy(nftArtist, TkMedal.address, MVerse.address, { from: ACCOUNT_CONTRACT_OWNER });
  let NFTArtist = await nftArtist.deployed()



  console.log("----------------------------------------------------------")
  console.log("$Medal Deployed at " + TkMedal.address)
  console.log("MedalVerse Deployed at " + MVerse.address)
  console.log("NFTArtist Deployed at " + NFTArtist.address)


  // Generates an public / private pair for fake sportsman / organizers
  function generateFakeAdr() {
    var id = crypto.randomBytes(32).toString('hex');
    var privateKey = "0x" + id;
    var wallet = new ethers.Wallet(privateKey);
    return wallet.address
  }


  // 
  let nftCounter = 1

  let priceT = ethers.BigNumber.from("500000000000000000000")
  let priceA = ethers.BigNumber.from("100000000000000000000")

  async function createNFT(nftOrganization, nftName, nftSymbol, name, img, account) {
    let nft = await throwIn.new(nftOrganization, NFTArtist.address, TkMedal.address, MVerse.address, nftName, nftSymbol, false, { from: ACCOUNT_CONTRACT_OWNER }); // constructor(string memory oragnization, address addressNFT_Medal, string memory name, string memory symbol)
    await TkMedal.approve(NFTArtist.address, priceA, { from: ACCOUNT_CONTRACT_OWNER })
    await TkMedal.approve(nft.address, priceT, { from: ACCOUNT_CONTRACT_OWNER })
    await NFTArtist.mintNFTArtist(name, img, { from: ACCOUNT_CONTRACT_OWNER })
    await nft.mintCup(nftCounter, { from: ACCOUNT_CONTRACT_OWNER });
    await nft.setYear(2022, { from: ACCOUNT_CONTRACT_OWNER })
    nftCounter++
    return nft;
  }

  /*
  async function mintCupNFT(nftOrganization, nftName, nftSymbol, img, year, participants) {
    let nft = await throwIn.new(nftOrganization, NFTArtist.address, nftName, nftSymbol, { from: ACCOUNT_CONTRACT_OWNER }); // constructor(string memory oragnization, address addressNFT_Medal, string memory name, string memory symbol)
    await NFTArtist.mintNFTArtist(nftName, img, { from: ACCOUNT_CONTRACT_OWNER })
    await nft.mintCup(nftCounter, { from: ACCOUNT_CONTRACT_OWNER })
    await nft.setYear(year, { from: ACCOUNT_CONTRACT_OWNER })
    // await nft.changeStatusToRegistrationOfParticipants({ from: ACCOUNT_CONTRACT_OWNER })
    // const promises = participants.map((participant) => {
    //   nft.addParticipant(participant.name, participant.account, { from: ACCOUNT_CONTRACT_OWNER })
    // })
    // const results = await Promise.all(promises)

    nftCounter++;
    return nft;
  } // mintCupNFT
*/

  async function setWinner(rcup, eventId, sporsmanId, organizerId) {

    await rcup.addWinner("François Coste", ACCOUNT_ATHLETE_01, { from: ACCOUNT_CONTRACT_OWNER })
    await MVerse.adminSetWinner(eventId, sporsmanId, { from: organizerId })
    // Il affecte la médaille au sportif vainqueur de l'évènement 
    await MVerse.adminAddMedal(eventId, rcup.address, { from: organizerId })
    await MVerse.adminGiveMedalToWinner(eventId, { from: organizerId })
  }

  function avatarRef(s) { return "/img/avatars/" + s }

  /* Ajouter un utilisateur */
  async function addFakeUser(nom, mail, role, unused) {
    // Local static counter for NFTs IDs
    const addFakeUser_initial_counter_value = 3 // fake accounts : 3 ... n
    addFakeUser.counter = addFakeUser.counter || addFakeUser_initial_counter_value;

    await MVerse.addNewUser(generateFakeAdr(), avatarRef(addFakeUser.counter.toString + ".jpg"), nom, mail, role, { from: ACCOUNT_CONTRACT_OWNER }); addFakeUser.counter++
  }

  const ACCOUNT_ORGANIZER_01 = accounts[1]
  const ACCOUNT_ATHLETE_01 = accounts[2]

  console.log("----------------------------------------------------------")
  console.log("Accounts")
  console.log(" Contract owner  : " + ACCOUNT_CONTRACT_OWNER)
  console.log(" Organizer 01 : " + ACCOUNT_ORGANIZER_01)
  console.log(" Athlete 01      : " + ACCOUNT_ATHLETE_01)
  console.log("----------------------------------------------------------")


  console.log("Populating with data ...")

  const ROLE_AUTHOR = 2
  const ROLE_ORGANIZER = 4
  const ROLE_ATHLETE = 8

  const ATHLETE_01_NAME = "François Coste"

  const date01_start = (new Date(2021, 01, 01, 12)).getTime()
  const date01_end = (new Date(2021, 01, 01, 14)).getTime()

  const date02_start = (new Date(2022, 12, 31, 08)).getTime()
  const date02_end = (new Date(2022, 12, 31, 15)).getTime()

  const date03_start = (new Date(2022, 01, 01, 17)).getTime()
  const date03_end = (new Date(2022, 01, 01, 23)).getTime()

  const date04_start = (new Date(2022, 01, 06, 15)).getTime()
  const date04_end = (new Date(2022, 01, 06, 19)).getTime()

  const Time01_start = ethers.BigNumber.from(Math.round(date01_start / 1000)); // Unix timestamp : millisec. -> sec.
  const Time01_end = ethers.BigNumber.from(Math.round(date01_end / 1000));

  const Time02_start = ethers.BigNumber.from(Math.round(date02_start / 1000));
  const Time02_end = ethers.BigNumber.from(Math.round(date02_end / 1000));

  const Time03_start = ethers.BigNumber.from(Math.round(date03_start / 1000));
  const Time03_end = ethers.BigNumber.from(Math.round(date03_end / 1000));

  const Time04_start = ethers.BigNumber.from(Math.round(date04_start / 1000));
  const Time04_end = ethers.BigNumber.from(Math.round(date04_end / 1000));


  const EVENT_ONE = 1;
  const EVENT_TWO = 2;
  const EVENT_THREE = 3;
  const EVENT_FOUR = 4;

  console.log(".")

  await MVerse.addNewUser(ACCOUNT_ORGANIZER_01, avatarRef("1.jpg"), "Paul_Henry", "pol@gmail.com", ROLE_ATHLETE + ROLE_ORGANIZER, { from: ACCOUNT_CONTRACT_OWNER })
  await MVerse.addNewUser(ACCOUNT_ATHLETE_01, avatarRef("2.jpg"), ATHLETE_01_NAME, "fcoste@free.fr", ROLE_ATHLETE, { from: ACCOUNT_CONTRACT_OWNER })

  await addFakeUser("Sonia Legendre", "slegendre@gmail.com", ROLE_ATHLETE, 0)
  console.log(".")
  await addFakeUser("Sandra Palin", "spali@hotmail.com", ROLE_ORGANIZER, 0)
  await addFakeUser("Cindy Quer", "cquer@icloud.com", ROLE_ATHLETE, 0)
  await addFakeUser("Sarah Comah", "scomah@yopmail.com", ROLE_ATHLETE, 0)
  /* console.log(".")
   await addFakeUser("Francois Lemin", "flemin@yahoo.fr", ROLE_ATHLETE, 0) //7
   await addFakeUser("Gregoire Kann", "gkann@hotmail.com", ROLE_ATHLETE, 0)
   await addFakeUser("Pierre Lemin", "plemin@yahoo.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Sandrine Praut", "spraut@free.fr", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Alain Terrieur", "aterrieur@yahoo.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Mimi Ferraud", "mferraud@free.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Yin Tran", "ytran@icloud.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Patricia Linn", "plinn@yahoo.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Lin Tran", "ltran@aol.com", ROLE_ATHLETE, 0)
   await addFakeUser("Fabien Oumal", "foumal@icloud.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Farah Linn", "flinn@free.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Inna Kassar", "ikassar@aol.com", ROLE_ATHLETE, 0)
   await addFakeUser("Alain Lebref", "alebref@hotmail.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Tse Fan", "tfan@aol.com", ROLE_ATHLETE, 0)
   await addFakeUser("Paul Mickel", "pmickel@yopmail.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Linn Bertram", "lbertram@yopmail.com", ROLE_ATHLETE, 0)
   await addFakeUser("Jean Labarthe", "jlabarthe@aol.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Fred Bert", "fbert@yahoo.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Ahmed Karr", "akarr@hotmail.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Yuri Leck", "yleck@free.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Annie Sebbagh", "asebbagh@icloud.com", ROLE_ATHLETE, 0)
   await addFakeUser("Linnette Arnaud", "larnaud@icloud.com", ROLE_ATHLETE, 0)
   console.log(".")
   await addFakeUser("Gérard Broux", "gbroux@yahoo.fr", ROLE_ATHLETE, 0)
   await addFakeUser("Cyril Mann", "cmann@yopmail.com", ROLE_ATHLETE, 0)
   await addFakeUser("Cédric Jompard", "cjompard@hotmail.com", ROLE_ATHLETE, 0)
   await addFakeUser("Annie Hall", "ahall@free.fr", ROLE_ATHLETE, 0)
   console.log(".")
 */
  let a = await MVerse.getUserCount({ from: ACCOUNT_CONTRACT_OWNER })
  console.log(a.toString() + ' users added')

  console.log("Creating organizations and events")

  function bkgRef(s) { return "/img/bkg/" + s }
  // L'organisateur créé des organisations
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFA", "Fédération Française d'Athlétisme", bkgRef("running.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFM", "Fédération Française de Motocross", bkgRef("motoracing.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFT", "Fédération Française de Tennis", bkgRef("tennis.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  console.log(".")

  // L'organisateur 01 organise ces évènements:
  // newEvent( organizationId, startDate, endDate, sportsCategory, eventDesc )
  await MVerse.newEvent(0, Time01_start, Time01_end, "Saison 14, Paris", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(EVENT_ONE, "48.9239455", "2.3536833", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(1, Time02_start, Time02_end, "Mx Moto-Station", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(EVENT_TWO, "48.9335885", "2.3873314", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time03_start, Time03_end, "Trophé des Champions, Saint-Denis", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(EVENT_THREE, "48.9192245", "2.36705", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(EVENT_FOUR, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  // evenements de test
  console.log(".")
  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 2", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(5, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 3", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(6, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 4", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(7, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 5", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(8, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 6", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(9, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 7", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(10, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 8", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(11, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 9", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(12, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 10", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(13, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 11", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(14, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 12", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(15, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  await MVerse.newEvent(2, Time04_start, Time04_end, "Coupe des coupes de gagnants de coupes 13", { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.adminSetEventPosition(16, "48.9267091", "2.3557909", { from: ACCOUNT_ORGANIZER_01 })

  console.log(".")

  // L'athlete 01 participe à ces évènements:
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_THREE);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_ONE);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_TWO);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_FOUR);

  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 5);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 6);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 7);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 8);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 9);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 10);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 11);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 12);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 13);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 14);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 15);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 16);
  console.log(".")

  // evenements de test
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 5);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 6);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 7);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 8);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 9);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 10);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 11);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 12);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 13);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 14);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 15);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, 16);
  console.log(".")


  // population de récompenses
  // L'organisateur 01 créée un NFT
  // createNFT( nftOrganization, nftName, nftSymbol, name, img, account)
  let rcup = await createNFT("Running Cup", "Running Nft", "RuNFT", "Athus Keller", "/img/medals/medal0.jpg", ACCOUNT_ORGANIZER_01)
  await MVerse.adminStartEvent(EVENT_ONE, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminEndEvent(EVENT_ONE, { from: ACCOUNT_ORGANIZER_01 })
  await setWinner(rcup, EVENT_ONE, ACCOUNT_ATHLETE_01, ACCOUNT_ORGANIZER_01)

  let rcup1 = await createNFT("Motocross Cup", "Motocross Nft", "McNFT", "Alban Perrin", "/img/medals/medal1.jpg", ACCOUNT_ORGANIZER_01)
  await MVerse.adminStartEvent(EVENT_TWO, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminEndEvent(EVENT_TWO, { from: ACCOUNT_ORGANIZER_01 })
  await setWinner(rcup1, EVENT_TWO, ACCOUNT_ATHLETE_01, ACCOUNT_ORGANIZER_01)

  let rcup2 = await createNFT("Tennis Cup", "Tennis Nft", "TNFT", "Gauthier Germain", "/img/medals/medal2.jpg", ACCOUNT_ORGANIZER_01)
  await MVerse.adminStartEvent(EVENT_THREE, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminEndEvent(EVENT_THREE, { from: ACCOUNT_ORGANIZER_01 })
  await setWinner(rcup2, EVENT_THREE, ACCOUNT_ATHLETE_01, ACCOUNT_ORGANIZER_01)

  console.log(".")

  // Competition 4
  await MVerse.adminStartEvent(EVENT_FOUR, { from: ACCOUNT_ORGANIZER_01 })

  // Create a competition reward but no winner
  let rcup3 = await createNFT("Tennis Cup 2", "Tennis Nft 2", "TNFT2", "Paul_Henry", "/img/medals/medal3.jpg", ACCOUNT_ORGANIZER_01)
  await rcup3.addWinner("François Coste", ACCOUNT_ATHLETE_01, { from: ACCOUNT_CONTRACT_OWNER })
  await MVerse.adminAddMedal(EVENT_FOUR, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })


  // evenements de test
  await MVerse.adminAddMedal(5,  rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(6,  rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(7,  rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(8,  rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(9,  rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(10, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(11, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(12, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(13, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(14, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(15, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })
  await MVerse.adminAddMedal(16, rcup3.address, { from: ACCOUNT_ORGANIZER_01 })


  console.log("done.")

};
