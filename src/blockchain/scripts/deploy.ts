import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    console.log("Deploying AvanomadWallet contract...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Check balance before deployment
    const balanceBefore = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balanceBefore)} AVAX`);
    
    // Deploy the contract
    const AvanomadWallet = await ethers.getContractFactory("AvanomadWallet");
    const wallet = await AvanomadWallet.deploy();
    
    // Wait for deployment to complete
    await wallet.deployed();
    console.log(`AvanomadWallet deployed to: ${wallet.address}`);
    
    // Check balance after deployment to see gas used
    const balanceAfter = await deployer.getBalance();
    console.log(`Deployment cost: ${ethers.utils.formatEther(balanceBefore.sub(balanceAfter))} AVAX`);
    
    // Update the .env file with the contract address
    const envPath = path.resolve(__dirname, "../../../.env");
    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Replace the CONTRACT_ADDRESS line
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${wallet.address}`
    );
    
    // Write back to .env file
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with contract address");
    
    // Output deployment information
    console.log("\nDeployment Summary:");
    console.log("-------------------");
    console.log(`Network: ${process.env.HARDHAT_NETWORK || "localhost"}`);
    console.log(`Contract Address: ${wallet.address}`);
    console.log(`Block Explorer: https://snowtrace.io/address/${wallet.address}`);
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });