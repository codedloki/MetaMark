const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy Registry Proxy
  const Registry = await ethers.getContractFactory("Registry");
  const registryProxy = await upgrades.deployProxy(Registry, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await registryProxy.waitForDeployment();
  const registryAddress = await registryProxy.getAddress();
  console.log("Registry Proxy deployed to:", registryAddress);

  // 2. Deploy Products Proxy
  const Products = await ethers.getContractFactory("Products");
  // initialize mein Registry ka address bhej rahe hain
  const productsProxy = await upgrades.deployProxy(Products, [registryAddress], {
    initializer: "initialize",
    kind: "uups",
  });
  await productsProxy.waitForDeployment();
  const productsAddress = await productsProxy.getAddress();
  console.log("Products Proxy deployed to:", productsAddress);

  console.log("✅ All Proxies Deployed!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});