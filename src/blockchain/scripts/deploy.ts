import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    console.log("🚀 Deploying BaseFiWallet contract to Base network...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Check balance before deployment
    const balanceBefore = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balanceBefore)} ETH`);
    
    // Deploy the contract
    const BaseFiWallet = await ethers.getContractFactory("BaseFiWallet");
    const wallet = await BaseFiWallet.deploy();
    
    // Wait for deployment to complete
    await wallet.deployed();
    console.log(`✅ BaseFiWallet deployed to: ${wallet.address}`);
    
    // Check balance after deployment to see gas used
    const balanceAfter = await deployer.getBalance();
    console.log(`Deployment cost: ${ethers.utils.formatEther(balanceBefore.sub(balanceAfter))} ETH`);
    
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
    console.log("✅ Updated .env file with contract address");
    
    // Determine network and explorer URL
    const network = process.env.HARDHAT_NETWORK || "localhost";
    const explorerUrl = network === "base" 
      ? `https://basescan.org/address/${wallet.address}`
      : `https://sepolia.basescan.org/address/${wallet.address}`;
    
    // Output deployment information
    console.log("\n📋 Deployment Summary:");
    console.log("═══════════════════════");
    console.log(`Network: ${network}`);
    console.log(`Contract Address: ${wallet.address}`);
    console.log(`Block Explorer: ${explorerUrl}`);
    console.log("\n💡 Next Steps:");
    console.log("1. Verify contract: npx hardhat verify --network baseSepolia " + wallet.address);
    console.log("2. Deploy BaseFiToken: npm run deploy-token");
    console.log("3. Update backend services to use new contract address");

    
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