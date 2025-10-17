import { network } from "hardhat";
import * as hre from "hardhat";
const ethers = hre.ethers;
import fs from "fs";
import path from "path";

async function main() {
  try {
    console.log("🚀 Deploying BaseFiToken to Base network...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Check balance before deployment
    const balanceBefore = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balanceBefore)} ETH`);
    
    // Deploy the token contract
    const BaseFiToken = await ethers.getContractFactory("BaseFiToken");
    const token = await BaseFiToken.deploy();
    
    // Wait for deployment
    await token.deployed();
    console.log(`✅ BaseFiToken deployed to: ${token.address}`);
    
    // Get token details
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    
    console.log(`\n📊 Token Details:`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Initial Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
    
    // Check balance after deployment
    const balanceAfter = await deployer.getBalance();
    console.log(`\nDeployment cost: ${ethers.utils.formatEther(balanceBefore.sub(balanceAfter))} ETH`);
    
    // Update environment variables
    const envPath = path.resolve(__dirname, "../../../.env");
    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Add or update TOKEN_ADDRESS
    if (envContent.includes("TOKEN_ADDRESS=")) {
      envContent = envContent.replace(
        /TOKEN_ADDRESS=.*/,
        `TOKEN_ADDRESS=${token.address}`
      );
    } else {
      envContent += `\nTOKEN_ADDRESS=${token.address}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env file with token address");
    
    // Determine network and explorer URL
    const networkName = process.env.HARDHAT_NETWORK || "localhost";
    const explorerUrl = networkName === "base" 
      ? `https://basescan.org/token/${token.address}`
      : `https://sepolia.basescan.org/token/${token.address}`;
    
    console.log("\n📋 Deployment Summary:");
    console.log("═══════════════════════");
    console.log(`Network: ${networkName}`);
    console.log(`Token Address: ${token.address}`);
    console.log(`Block Explorer: ${explorerUrl}`);
    console.log("\n💡 Next Steps:");
    console.log(`1. Verify contract: npx hardhat verify --network baseSepolia ${token.address}`);
    console.log("2. Update backend token service with new address");
    console.log("3. Test token minting and transfers");

    
  } catch (error) {
    console.error("Token deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });