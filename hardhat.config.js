require("@nomiclabs/hardhat-waffle"); // It also automatically import hardhat-ethers becuase it depends on it
/*
HardHat-ethers have specific functions for hardhat compatibility which ethers.js dont have. 
HardHat-waffle also injects chai-waffle matchers auto.
*/



const secret = require("./environment/secrets.json");

module.exports = {
  solidity: "0.8.0",

  defaultNetwork: "ropsten",
  networks: {
    ropsten: {
      url: secret.ropstenNode,
      accounts: [secret.privateKeyRopsten]
    },
    // mumbai: {
    //   url: secret.mumbaiNode,
    //   accounts: [secret.privateKeyMumbai]
    // }, 
  },


  paths: {
    sources: "./blockchain/contracts",
    tests: "./blockchain/test",
    cache: "./blockchain/cache",
    artifacts: "./blockchain/artifacts"
  }
};
