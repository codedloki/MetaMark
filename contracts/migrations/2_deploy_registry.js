const Registry = artifacts.require("Registry");
const Products = artifacts.require("Products");

// module.exports = async function (deployer) {
//   // Step 1: Deploy Registry
//   await deployer.deploy(Registry);
//   const registry = await Registry.deployed();

//   // Step 2: Deploy ProductRegistry with Registry's address
//   await deployer.deploy(Products, registry.address);
// };
//
module.exports = async function (deployer, network, accounts) {
  // Step 1: Deploy Registry
  await deployer.deploy(Registry);
  const registry = await Registry.deployed();
  console.log("Registry deployed at:", registry.address);

  // Step 2: Deploy Products with Registry's address
  if (!registry.address) throw new Error("Registry address not found!");
  await deployer.deploy(Products, registry.address);
  const products = await Products.deployed();
  console.log("Products deployed at:", products.address);
};
