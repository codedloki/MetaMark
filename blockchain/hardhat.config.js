require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades"); 
require("dotenv").config(); // <--- YE SABSE ZAROORI HAI

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    amoy: {
      url: 'https://rpc-amoy.polygon.technology',
      // Ab process.env.PRIVATE_KEY sahi se load hoga
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      // Brackets [] hata diye hain yahan se
      polygonAmoy: process.env.POLYGONSCAN_API,
    }
  }
};