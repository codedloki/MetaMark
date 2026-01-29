const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  const Registry = await hre.ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log("Registry deployed to:", await registry.getAddress());

  const Products = await hre.ethers.getContractFactory("Products");
  const products = await Products.deploy(await registry.getAddress());
  await products.waitForDeployment();

  console.log("Products deployed to:", await products.getAddress());
  console.log("✅ Deployment complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
