import { ethers } from 'ethers';
import dotenv from 'dotenv';
import logger from '../../config/logger';
dotenv.config();

if (!process.env.BASE_RPC_URL) {
  throw new Error(
    'BASE_RPC_URL must be set in .env'
  );
}

// Base Network (Sepolia testnet or Mainnet)
export const baseProvider = new ethers.providers.JsonRpcProvider(
  process.env.BASE_RPC_URL
);

// Default provider for backward compatibility
export const provider = baseProvider;

// Legacy exports for backward compatibility (deprecated - use baseProvider instead)
export const avalancheProvider = baseProvider;
export const ethereumProvider = baseProvider;

// Get wallet connected to Base
export const getWallet = () => {
  if (!process.env.PRIVATE_KEY) {
    logger.error('PRIVATE_KEY is not defined in the environment variables');
    process.exit(1);
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, baseProvider);
};

// Legacy function for backward compatibility (deprecated - use getWallet instead)
export const getEthereumWallet = () => {
  return getWallet();
};

// Get contract instance
export const getContract = (address: string, abi: any, useEthereum = false) => {
  const wallet = getWallet();
  return new ethers.Contract(address, abi, wallet);
};