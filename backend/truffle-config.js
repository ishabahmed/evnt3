const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const privateKeys = [`0x${process.env.PRIVATE_KEY}`];

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
    },
    mumbai: {
        provider: () => new HDWalletProvider(privateKeys, `https://polygon-mumbai.g.alchemy.com/v2/m74DYm6HHQD1039u6MdDLoOIeKwop7OY`),
        network_id: 80001,
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true,
    }
  },

  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
