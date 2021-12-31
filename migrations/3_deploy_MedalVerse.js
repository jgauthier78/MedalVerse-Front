var MedalVerse = artifacts.require("./MedalVerse.sol");
const throwIn = artifacts.require('ThrowIn');
const nftMedal = artifacts.require('NFTMedaille');

const ethers = require('ethers');
const crypto = require('crypto');
const { cp } = require('fs');

module.exports = async function (deployer, network, accounts) {

  //let accounts = await web3.eth.getAccounts()

  const ACCOUNT_CONTRACT_OWNER = accounts[0]

  await deployer.deploy(MedalVerse, { from: ACCOUNT_CONTRACT_OWNER });

  let MVerse = await MedalVerse.deployed()


  console.log("----------------------------------------------------------")
  console.log("MedalVerse Deployed at " + MVerse.address)


  // Generates an public / private pair for fake sportsman / organizers
  function generateFakeAdr() {
    var id = crypto.randomBytes(32).toString('hex');
    var privateKey = "0x" + id;
    var wallet = new ethers.Wallet(privateKey);
    return wallet.address
  }


  // 

  async function createNFT(nftOrganization, nftName, nftSymbol, name, img, account) {
    // Local static counter for NFTs IDs
    const createNFT_initial_counter_value = 1
    createNFT.counter = createNFT.counter || createNFT_initial_counter_value;

    let medal = await nftMedal.new()
    let nft = await throwIn.new(nftOrganization, medal.address, nftName, nftSymbol, { from: ACCOUNT_CONTRACT_OWNER }); // constructor(string memory oragnization, address addressNFT_Medal, string memory name, string memory symbol)
    await medal.mintNFTMedaille(name, img, { from: ACCOUNT_CONTRACT_OWNER })
    await nft.mintCup(createNFT.counter, { from: ACCOUNT_CONTRACT_OWNER });
    await nft.addParticipant(name, account, { from: ACCOUNT_CONTRACT_OWNER });

    createNFT.counter++
    return nft;
  }

  function avatarRef(s) { return "/img/avatars/" + s }

  /* Ajouter un utilisateur */
  async function addFakeUser(nom, mail, role, sportsCategory) {
    // Local static counter for NFTs IDs
    const addFakeUser_initial_counter_value = 3 // fake accounts : 3 ... n
    addFakeUser.counter = addFakeUser.counter || addFakeUser_initial_counter_value;

    await MVerse.addNewUser(generateFakeAdr(), avatarRef(addFakeUser.counter.toString + ".jpg"), nom, mail, role, sportsCategory, { from: ACCOUNT_CONTRACT_OWNER }); addFakeUser.counter++
  }

  const ACCOUNT_ORGANIZER_01 = accounts[1] // account1
  const ACCOUNT_ATHLETE_01 = accounts[2] // account0

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

  const date01_start = (new Date(2021, 01, 01, 12)).getTime()
  const date01_end = (new Date(2021, 01, 01, 14)).getTime()

  const date02_start = (new Date(2022, 12, 31, 08)).getTime()
  const date02_end = (new Date(2022, 12, 31, 15)).getTime()

  const date03_start = (new Date(2022, 01, 01, 17)).getTime()
  const date03_end = (new Date(2022, 01, 01, 23)).getTime()

  const Time01_start = ethers.BigNumber.from(Math.round(date01_start / 1000)); // Unix timestamp : millisec. -> sec.
  const Time01_end = ethers.BigNumber.from(Math.round(date01_end / 1000));

  const Time02_start = ethers.BigNumber.from(Math.round(date02_start / 1000));
  const Time02_end = ethers.BigNumber.from(Math.round(date02_end / 1000));

  const Time03_start = ethers.BigNumber.from(Math.round(date03_start / 1000));
  const Time03_end = ethers.BigNumber.from(Math.round(date03_end / 1000));

  /*************************************/

  const EVENT_ONE = 1;
  const EVENT_TWO = 2;
  const EVENT_THREE = 3;

  console.log(".")

  await MVerse.addNewUser(ACCOUNT_ORGANIZER_01, avatarRef("1.jpg"), "Paul_Henry", "pol@gmail.com", ROLE_ATHLETE + ROLE_ORGANIZER, 0, { from: ACCOUNT_CONTRACT_OWNER })
  await MVerse.addNewUser(ACCOUNT_ATHLETE_01, avatarRef("2.jpg"), "François Coste", "fcoste@free.fr", ROLE_ATHLETE, 0, { from: ACCOUNT_CONTRACT_OWNER })

  await addFakeUser("Sonia Legendre", "slegendre@gmail.com", ROLE_ATHLETE, 0)
  console.log(".")
  await addFakeUser("Sandra Palin", "spali@hotmail.com", ROLE_ORGANIZER, 0)
  await addFakeUser("Cindy Quer", "cquer@icloud.com", ROLE_ATHLETE, 0)
  await addFakeUser("Sarah Comah", "scomah@yopmail.com", ROLE_ATHLETE, 0)
  console.log(".")
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

  let a = await MVerse.getUserCount({ from: ACCOUNT_CONTRACT_OWNER })
  console.log(a.toString() + ' users added')

  console.log("Creating organizations and events")

  function bkgRef(s) { return "/img/bkg/" + s }
  // L'organisateur créé des organisations
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFA", "Fédération Française d'Athlétisme", bkgRef("running.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFM", "Fédération Française de Motocross", bkgRef("motoracing.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.addOrganization(ACCOUNT_ORGANIZER_01, "FFT", "Fédération Française de Tennis", bkgRef("tennis.jpg"), { from: ACCOUNT_CONTRACT_OWNER });
  console.log(".")
  // L'organisateur créé des administateurs d'organisations
  await MVerse.organizationAddAdmin(0, ACCOUNT_ORGANIZER_01, { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.organizationAddAdmin(1, ACCOUNT_ORGANIZER_01, { from: ACCOUNT_CONTRACT_OWNER });
  await MVerse.organizationAddAdmin(2, ACCOUNT_ORGANIZER_01, { from: ACCOUNT_CONTRACT_OWNER });
  console.log(".")

  // L'organisateur 01 organise ces évènements:
  await MVerse.newEvent(0, Time01_start, Time01_end, 2, { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.newEvent(1, Time02_start, Time02_end, 4, { from: ACCOUNT_ORGANIZER_01 });
  await MVerse.newEvent(2, Time03_start, Time03_end, 4, { from: ACCOUNT_ORGANIZER_01 });
  console.log(".")

  // L'athlete 01 participe à ces évènements:
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_THREE);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_ONE);
  await MVerse.LinkUserAndEvent(ACCOUNT_ATHLETE_01, EVENT_TWO);
  console.log(".")


  // population de récompenses
  // L'organisateur 01 créée un NFT
  // createNFT( nftOrganization, nftName, nftSymbol, name, img, account)
  let rcup = await createNFT("Running Cup", "Running Nft", "RuNFT", "François Coste", "/img/medals/medal0.jpg", ACCOUNT_ORGANIZER_01)
  // Il déclare le gagnant de l'évènement 01
  await MVerse.adminSetWinner(EVENT_ONE, ACCOUNT_ATHLETE_01, { from: ACCOUNT_ORGANIZER_01 })
  // Il affecte la médaille au sportif vainqueur de l'évènement 
  await MVerse.adminAddMedal(EVENT_ONE, rcup.address, { from: ACCOUNT_ORGANIZER_01 })

  console.log("done.")

};
