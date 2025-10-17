import { Wallet } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import dotenv from 'dotenv';
import logger from './logger';
import { avalancheProvider, ethereumProvider } from '../blockchain/services/provider';

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY must be set in .env');
}

const pk = process.env.PRIVATE_KEY.trim();

// Faucet / funding wallet on Avalanche Fuji C-Chain
export const faucetWallet = new Wallet(pk, avalancheProvider);

// Same key on Sepolia (for gas funding or ETH transfers)
export const faucetWalletEth = new Wallet(pk, ethereumProvider);

// Get balance of faucet wallet
export const getFaucetBalance = async (token = 'AVAX') => {
  try {
    if (token === 'AVAX') {
      const balance = await faucetWallet.getBalance();
      return {
        formatted: formatEther(balance),
        raw: balance
      };
    } else if (token === 'ETH') {
      const balance = await faucetWalletEth.getBalance();
      return {
        formatted: formatEther(balance),
        raw: balance
      };
    }
    return { formatted: '0', raw: '0' };
  } catch (error) {
    logger.error('Error checking faucet balance:', error);
    return { formatted: '0', raw: '0' };
  }
};

// Log faucet wallet info
export const logFaucetInfo = async () => {
  try {
    logger.info(`Faucet wallet address: ${faucetWallet.address}`);
    const avaxBalance = await getFaucetBalance('AVAX');
    const ethBalance = await getFaucetBalance('ETH');
    logger.info(`Faucet AVAX balance: ${avaxBalance.formatted}`);
    logger.info(`Faucet ETH balance: ${ethBalance.formatted}`);
  } catch (error) {
    logger.error('Error logging faucet info:', error);
  }
};