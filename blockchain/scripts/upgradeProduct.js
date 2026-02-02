const { ethers, upgrades } = require("hardhat");

async function main() {
  // 1. Apne existing Proxy ka address yahan daal (Jo .env mein hai)
  const proxyAddress = "0xCd947a6f78Ad1BF2bE7B27628c8Adf716Bc88B2e"; 

  console.log("Upgrading Products contract at:", proxyAddress);

  // 2. Naya logic (Products.sol) load karo
  const ProductsV2 = await ethers.getContractFactory("Products");

  // 3. Upgrade call
  // Yeh function naya implementation deploy karega aur proxy ko update karega
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ProductsV2, {
    kind: "uups",
  });

  await upgraded.waitForDeployment();

  console.log("✅ Products Contract Upgraded Successfully!");
  console.log("Proxy Address (Same):", await upgraded.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });