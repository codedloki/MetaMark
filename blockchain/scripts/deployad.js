const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Amoy par balance check karne ke liye
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("--------------------------------------------------");
  console.log("Network: Amoy Testnet");
  console.log("Deploying contracts with:", deployer.address);
  console.log("Current Balance:", ethers.formatEther(balance), "MATIC");
  console.log("--------------------------------------------------\n");

  // Helper function: Gas stats aur Cost calculate karne ke liye
  const printGasStats = async (proxy, name) => {
    const tx = proxy.deploymentTransaction();
    const receipt = await tx.wait();
    
    // Gas Price wei mein (tx se nikalenge)
    const gasPrice = tx.gasPrice;
    // Total Cost: gasUsed * gasPrice
    const totalCost = receipt.gasUsed * gasPrice;

    console.log(`\n--- ${name} Proxy Deployment Stats ---`);
    console.log(`Transaction Hash: ${receipt.hash}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`Actual Cost: ${ethers.formatEther(totalCost)} MATIC`);
    console.log(`---------------------------------------\n`);
    
    return totalCost;
  };

  // 1. Deploy Registry Proxy
  console.log("Step 1: Deploying Registry...");
  const Registry = await ethers.getContractFactory("Registry");
  const registryProxy = await upgrades.deployProxy(Registry, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await registryProxy.waitForDeployment();
  const registryAddress = await registryProxy.getAddress();
  console.log("Registry Proxy Address:", registryAddress);
  const cost1 = await printGasStats(registryProxy, "Registry");

  // 2. Deploy Products Proxy
  console.log("Step 2: Deploying Products...");
  const Products = await ethers.getContractFactory("Products");
  const productsProxy = await upgrades.deployProxy(Products, [registryAddress], {
    initializer: "initialize",
    kind: "uups",
  });
  await productsProxy.waitForDeployment();
  const productsAddress = await productsProxy.getAddress();
  console.log("Products Proxy Address:", productsAddress);
  const cost2 = await printGasStats(productsProxy, "Products");

  // Final Summary
  const totalDeploymentCost = cost1 + cost2;
  const finalBalance = await ethers.provider.getBalance(deployer.address);

  console.log("==================================================");
  console.log("✅ DEPLOYMENT COMPLETE");
  console.log("Total Spent:", ethers.formatEther(totalDeploymentCost), "MATIC");
  console.log("Remaining Balance:", ethers.formatEther(finalBalance), "MATIC");
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});