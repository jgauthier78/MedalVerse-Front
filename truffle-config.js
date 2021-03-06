const Path = require("path");
const Web3 = require('web3');

require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');



// Local Wallet Mnemonic used for deployments
Wallet_mnemonic_LOCAL = process.env.Wallet_mnemonic_LOCAL

// Common Wallet Mnemonic used for deployments
Wallet_mnemonic_MEDELAVERSE_COMMON = process.env.Wallet_mnemonic_MEDELAVERSE_COMMON

Infura_ProjectId = process.env.InfuraProjectId
Infura_ProjectSecret = process.env.InfuraProjectSecret

// Alternative deployment nodes
AlchemyProjectId = process.env.AlchemyProjectId

Matic_MedalVerse_Dev_01_ProjectId = process.env.Matic_MedalVerse_Dev_01_ProjectId

// Network Ids
const network_id_rinkeby = 4;
const network_id_ropsten = 3;
const network_id_kovan = 42;

const network_id_maticMumbaiTestnet = 80001;

// RPC Urls

// Ethereum Tesnets
const Ethereum_Tesnet__Kovan_Infura_RPC_URL = 'https://kovan.infura.io/v3/';
const Ethereum_Tesnet__Ropsten_Infura_RPC_URL = 'https://ropsten.infura.io/v3/';
const Ethereum_Tesnet__Rinkeby_Infura_RPC_URL = 'https://rinkeby.infura.io/v3/';

// Mumbai Testnet RPC URL
const Matic_Tesnet_RPC_HTTPS_URL_1 = 'https://rpc-mumbai.maticvigil.com/v1/';
// const Matic_Tesnet_RPC_HTTPS_URL_2 = 'https://rpc-mumbai.matic.today';
// const Matic_Tesnet_RPC_HTTPS_URL_3 = 'https://matic-mumbai.chainstacklabs.com';
// const Matic_Tesnet_RPC_HTTPS_URL_4 = 'https://matic-testnet-archive-rpc.bwarelabs.com';

const Matic_Tesnet_RPC_WSS_URL_1 = 'wss://rpc-mumbai.maticvigil.com/ws/v1/';
// const Matic_Tesnet_RPC_WSS_URL_2 = 'wss://rpc-mumbai.matic.today';
// const Matic_Tesnet_RPC_WSS_URL_3 = 'wss://ws-matic-mumbai.chainstacklabs.com';
// const Matic_Tesnet_RPC_WSS_URL_4 = 'wss://matic-testnet-archive-ws.bwarelabs.com';

const Matic_Testnet_Infura_RPC = 'https://polygon-mumbai.infura.io/v3/'

const Matic_Testnet_Alchemy_RPC = 'https://polygon-mumbai.g.alchemy.com/v2/'

// Matic Mainnet RPC URL
const Matic_Mainnet_RPC_URL = 'https://rpc-mainnet.maticvigil.com/v1/';

module.exports =
{
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: Path.join(__dirname, "client/src/contracts")

  ,

  compilers:
  {
    solc:
    {
      version: "0.8.0",
      settings:
      { // See the solidity docs for advice about optimization and evmVersion
        optimizer:
        {
          enabled: true,
          runs: 20
        }
      }
    }
  }

  ,

  networks:
  {
    // networks : ?? commenter pour les tests ou itiliser une regexp (-g)

    development:
    {
      host: "127.0.0.1", // localhost de notre r??seau ganache 
      port: 8545, // le port rpc de notre r??seau ganache 
      network_id: "*", // Match any network id (default: none)
      gas: 6721975,

    },

    devlocalbenoist:
    {
      host: "127.0.0.1", // localhost de notre r??seau ganache 
      port: 8545, // le port rpc de notre r??seau ganache 
      network_id: "3333",// le network id de notre r??seau ganache 
      gas: 6721975,
    },

    ropsten:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_LOCAL, Ethereum_Tesnet__Ropsten_Infura_RPC_URL + Infura_ProjectId),
      network_id: network_id_ropsten,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      gasPrice: Web3.utils.toWei("50", "gwei"),
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

    kovan:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_LOCAL, Ethereum_Tesnet__Kovan_Infura_RPC_URL + Infura_ProjectId),
      network_id: network_id_kovan,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      gasPrice: Web3.utils.toWei("5", "gwei"),
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

    rinkeby:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_LOCAL, Ethereum_Tesnet__Rinkeby_Infura_RPC_URL + Infura_ProjectId),
      network_id: network_id_rinkeby,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      gasPrice: Web3.utils.toWei("5", "gwei"),
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },


    maticMumbaiTestnetInfuraSlow:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_MEDELAVERSE_COMMON, Matic_Testnet_Infura_RPC + Infura_ProjectId),
      network_id: network_id_maticMumbaiTestnet,
      confirmations: 4,
      networkCheckTimeout: 5000,
      timeoutBlocks: 5000,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },

    maticMumbaiTestnetInfuraFast:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_MEDELAVERSE_COMMON, Matic_Testnet_Infura_RPC + Infura_ProjectId),
      network_id: network_id_maticMumbaiTestnet,
      confirmations: 1,
      networkCheckTimeout: 1000,
      timeoutBlocks: 1000,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },

    maticMumbaiTestnetAlchemySlow:
    {
      provider: () => new HDWalletProvider(Wallet_mnemonic_MEDELAVERSE_COMMON, Matic_Testnet_Alchemy_RPC + AlchemyProjectId),
      network_id: network_id_maticMumbaiTestnet,
      confirmations: 4,
      networkCheckTimeout: 5000,
      timeoutBlocks: 5000,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },

    maticMumbaiTestnet:
    {
      provider: () => new HDWalletProvider( Wallet_mnemonic_MEDELAVERSE_COMMON, Matic_Tesnet_RPC_HTTPS_URL_1 + Matic_MedalVerse_Dev_01_ProjectId ),
      network_id: network_id_maticMumbaiTestnet,
      confirmations: 4,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },

  } // networks

};
