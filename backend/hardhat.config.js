require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers : [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.13",
      },
    ]
  },
  paths: {
    artifacts: '../frontend/src/artifacts',
  },


  // add solidity version 0.8.13


};
