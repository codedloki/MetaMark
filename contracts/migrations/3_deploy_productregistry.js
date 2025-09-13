const Registry = artifacts.require("Registry");
const Products = artifacts.require("Products");

module.exports = async function (deployer) {
  // Step 1: Deploy Registry
  await deployer.deploy(Registry);
  const registry = await Registry.deployed();

  // Step 2: Deploy ProductRegistry with Registry's address
  await deployer.deploy(Products, registry.address);
};
