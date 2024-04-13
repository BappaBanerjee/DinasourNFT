/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

require("hardhat-contract-sizer");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  solidity: {
    // version: "0.8.19",
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 666666,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
