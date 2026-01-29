const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const artifact = await hre.artifacts.readArtifact("Registry");

  // define folder and path
  const abiDir = path.join(__dirname, "../../src/abi/"); // relative to scripts/
  const abiPath = path.join(abiDir, "Registry.json");

  // create folder if missing
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  // write the ABI
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));

  console.log("ABI created successfully at", abiPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

