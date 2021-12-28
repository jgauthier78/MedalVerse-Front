var MedalVerse = artifacts.require("./MedalVerse.sol");
const ethers = require('ethers');
const crypto = require('crypto');

module.exports = async function (deployer) {
  await deployer.deploy(MedalVerse);

  let accounts = await web3.eth.getAccounts()
  let MVerse = await MedalVerse.deployed()

  console.log("MedalVerse Deployed ------------")
  console.log("Populating with Users")


  // Generates an public / private pair for fake sportsman / organizers
  function generateFakeAdr() {
    var id = crypto.randomBytes(32).toString('hex');
    var privateKey = "0x" + id;
    var wallet = new ethers.Wallet(privateKey);
    return wallet.address
  }


  let indx = 3;
  const Author = 2
  const Organizer = 4
  const Sportsman = 8
  const date1 = (new Date(2021, 01, 01)).getTime()
  const date2 = (new Date(2022, 12, 31)).getTime()
  const date3 = (new Date(2022, 01, 01)).getTime()

  const Time1 = ethers.BigNumber.from(Math.round(date1 / 1000)); // Unix timestamp : millisec. -> sec.
  const Time2 = ethers.BigNumber.from(Math.round(date2 / 1000)); // Unix timestamp : millisec. -> sec.
  const Time3 = ethers.BigNumber.from(Math.round(date3 / 1000));

  /* Ajouter un utilisateur */
  function avatarRef(s) { return "/img/avatars/" + s }
  async function addUser(nom, mail, role, gout) {
    await MVerse.addNewUser(generateFakeAdr(), avatarRef(indx.toString + ".jpg"), nom, mail + "@gmail.com", role, gout, { from: accounts[0] }); indx++
  }
  /*************************************/

  await MVerse.addNewUser(accounts[1], avatarRef("1.jpg"), "Paul_Henry", "pol@gmail.com", Sportsman + Organizer, 0, { from: accounts[0] })
  await MVerse.addNewUser(accounts[0], avatarRef("2.jpg"), "François Coste", "fcoste@gmail.com", Sportsman, 0, { from: accounts[0] })
  console.log(accounts[1] + " : Organisateur")
  console.log(accounts[0] + " : Sportif")
  await addUser("Sonia Legendre", "slegendre", Sportsman, 0)
  await addUser("Sandra Palin", "slegendre", Organizer, 0)
  await addUser("Cindy Quer ", "cquer", Sportsman, 0)
  await addUser("Sarah Comah", "scomah", Sportsman, 0)
  await addUser("Francois Lemin", "flemin", Sportsman, 0) //7
  await addUser("Gregoire Kann", "gkann", Sportsman, 0)
  await addUser("Pierre Lemin", "plemin", Sportsman, 0)
  await addUser("Sandrine Praut", "spraut", Sportsman, 0)
  await addUser("Alain Terrieur", "aterrieur", Sportsman, 0)
  await addUser("Mimi Ferraud", "mferraud", Sportsman, 0)
  await addUser("Yin Tran", "ytran", Sportsman, 0)
  await addUser("Patricia Linn", "plinn", Sportsman, 0)
  await addUser("Lin Tran", "ltran", Sportsman, 0)
  await addUser("Fabien Oumal", "foumal", Sportsman, 0)
  await addUser("Farah Linn", "flinn", Sportsman, 0)
  await addUser("Inna Kassar", "ikassar", Sportsman, 0)
  await addUser("Alain Lebref", "alebref", Sportsman, 0)
  await addUser("Tse Fan", "tfan", Sportsman, 0)
  await addUser("Paul Mickel", "pmickel", Sportsman, 0)
  await addUser("Linn Bertram", "lbertram", Sportsman, 0)
  await addUser("Jean Labarthe", "jlabarthe", Sportsman, 0)
  await addUser("Fred Bert", "fbert", Sportsman, 0)
  await addUser("Ahmed Karr", "akarr", Sportsman, 0)
  await addUser("Yuri Leck", "yleck", Sportsman, 0)
  await addUser("Annie Sebbagh", "asebbagh", Sportsman, 0)
  await addUser("Linnette Arnaud", "larnaud", Sportsman, 0)
  await addUser("Gérard Broux", "gbroux", Sportsman, 0)
  await addUser("Cyril Mann", "cmann", Sportsman, 0)
  await addUser("Cédric Jompard", "cjompard", Sportsman, 0)
  await addUser("Annie Hall", "ahall", Sportsman, 0)

  let a = await MVerse.getUserCount({ from: accounts[0] })
  console.log(a.toString() + ' utilisateurs ajoutés')

  function bkgRef(s) { return "/img/bkg/" + s }
  await MVerse.addOrganization(accounts[1], "FFA", "Fédération Française d'Athlétisme", bkgRef("running.jpg"), { from: accounts[0] });
  await MVerse.addOrganization(accounts[1], "FFM", "Fédération Française de Motocross", bkgRef("motoracing.jpg"), { from: accounts[0] });
  await MVerse.addOrganization(accounts[1], "FFT", "Fédération Française de Tennis", bkgRef("tennis.jpg"), { from: accounts[0] });
  await MVerse.organizationAddAdmin(0, accounts[1], { from: accounts[0] });
  await MVerse.organizationAddAdmin(1, accounts[1], { from: accounts[0] });
  await MVerse.organizationAddAdmin(2, accounts[1], { from: accounts[0] });

  await MVerse.newEvent(0, Time1, Time2, 2, { from: accounts[1] });
  await MVerse.newEvent(1, Time1, Time2, 4, { from: accounts[1] });
  await MVerse.newEvent(2, Time1, Time2, 4, { from: accounts[1] });

  await MVerse.LinkUserAndEvent(accounts[0], 2);
  await MVerse.LinkUserAndEvent(accounts[0], 0);
  await MVerse.LinkUserAndEvent(accounts[0], 1);

};
