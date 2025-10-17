import { network } from "hardhat";
import * as hre from "hardhat";
const ethers = hre.ethers;
import fs from "fs";
import path from "path";

async function main() {
  try {
    console.log("Deploying AvanomadToken...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Deploy the token contract
    const AvanomadToken = await ethers.getContractFactory("AvanomadToken");
    const token = await AvanomadToken.deploy();
    
    // Wait for deployment
    await token.deployed();
    console.log(`AvanomadToken deployed to: ${token.address}`);
    
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
    console.log("Updated .env file with token address");
    
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