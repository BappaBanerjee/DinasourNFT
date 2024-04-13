const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const EGGToken = await ethers.getContract("EGGToken", deployer);
  const EGGTokenAddr = await EGGToken.getAddress();
  const token = await deploy("Dinosaur", {
    from: deployer,
    args: [deployer, EGGTokenAddr],
    log: true,
  });
  log(`Dinosaur NFT deployed at ${token.address}`);
};
module.exports.tags = ["all", "Dinosaur"];
