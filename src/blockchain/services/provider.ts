import { ethers } from 'ethers';
import dotenv from 'dotenv';
import logger from '../../config/logger';
dotenv.config();

if (!process.env.AVALANCHE_RPC_URL || !process.env.ETHEREUM_RPC_URL) {
  throw new Error(
    'AVALANCHE_RPC_URL and ETHEREUM_RPC_URL must be set in .env'
  );
}

// Avalanche C-Chain (Fuji testnet)
export const avalancheProvider = new ethers.providers.JsonRpcProvider(
  process.env.AVALANCHE_RPC_URL
);

// Ethereum Sepolia
export const ethereumProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL
);

// Default provider for backward compatibility
export const provider = avalancheProvider;

// Get wallet connected to Avalanche
export const getWallet = () => {
  if (!process.env.PRIVATE_KEY) {
    logger.error('PRIVATE_KEY is not defined in the environment variables');
    process.exit(1);
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, avalancheProvider);
};

// Get wallet connected to Ethereum
export const getEthereumWallet = () => {
  if (!process.env.PRIVATE_KEY) {
    logger.error('PRIVATE_KEY is not defined in the environment variables');
    process.exit(1);
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, ethereumProvider);
};

// Get contract instance
export const getContract = (address: string, abi: any, useEthereum = false) => {
  const wallet = useEthereum ? getEthereumWallet() : getWallet();
  return new ethers.Contract(address, abi, wallet);
};