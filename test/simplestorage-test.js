
// **********************************************
// Require

const SimpleStorage = artifacts.require("./SimpleStorage.sol");

/*
const chai = require('chai');
const BN = require('bn.js');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));
*/

var BigNumber = require('bignumber.js');
var chai = require('chai');
var expect = require('chai').expect

// **********************************************

// Setup
chai.use(require('chai-bignumber')(BigNumber));

// -----------------------------------
// Test suite contract SimpleStorage
// ------------------------------------
contract("SimpleStorage", accounts =>
  {

  // ---------------------------------------------------------
  // Variables GLOBALES à la suite SimpleStorage

  const NUMBER_ZERO = 0;
  const NUMBER_HEIGHTYNINE = 89


  var account_0_initialBalance_InWei = NUMBER_ZERO;
  // var initialBalanceInWei = BIGNUMBER_ZERO;

  // Inits
  before(
      async function()
      {
        const currentAccount0BalanceInWei = await web3.eth.getBalance( accounts[0] )
        account_0_initialBalance_InWei = new BigNumber(currentAccount0BalanceInWei);
      }
    );

  // ---------------------------------------------------------

    it("should give accounts[0] initial balance greater than 0.",
      function()
      {
        expect(account_0_initialBalance_InWei).to.be.bignumber.gt(NUMBER_ZERO);
  /*
    var result = new BigNumber("100000000000000000").plus(1);
  var expected = "100000000000000001";
  expect(result).to.be.bignumber.equal(expected);
  */

      }
    );

    // ---------------------------------------------------------

    it("accounts[0] balance should be unchanged.", async () => {
      const currentAccount0BalanceInWei = await web3.eth.getBalance( accounts[0] ) ;
      expect(currentAccount0BalanceInWei).to.be.bignumber.equal(account_0_initialBalance_InWei);
    });

    // ---------------------------------------------------------

    it("...should store the value "+NUMBER_HEIGHTYNINE+".", async () => {
      const simpleStorageInstance = await SimpleStorage.deployed();

      // Set value of NUMBER_HEIGHTYNINE
      await simpleStorageInstance.set(NUMBER_HEIGHTYNINE, { from: accounts[0] });

      // Get stored value
      const storedData = await simpleStorageInstance.get.call();

      assert.equal(storedData, NUMBER_HEIGHTYNINE, "The value 89 was not stored.");
    });

  // ---------------------------------------------------------

    it("accounts[0] balance should have decreased due to gas consumption.", async () => {
      const currentAccount0BalanceInWei = new BigNumber(await web3.eth.getBalance( accounts[0] ) )
      expect(currentAccount0BalanceInWei).to.be.bignumber.lt(account_0_initialBalance_InWei);
    });

   // ---------------------------------------------------------

  }); // Test suite contract SimpleStorage

// -----------------------------------
// Test suite X
// ------------------------------------