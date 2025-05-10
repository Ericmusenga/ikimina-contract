const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const IkiminaSystem = await hre.ethers.getContractFactory("IkiminaSystem");

  // Deploy the contract and wait for it
  const ikimina = await IkiminaSystem.deploy(); // Deploy returns a Contract instance

  // Wait until it's mined
  await ikimina.waitForDeployment();

  // Get the address
  const address = await ikimina.getAddress();

  console.log("IkiminaSystem deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
