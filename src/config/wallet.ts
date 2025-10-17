import { Wallet } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import dotenv from 'dotenv';
import logger from './logger';
import { baseProvider } from '../blockchain/services/provider';

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY must be set in .env');
}

const pk = process.env.PRIVATE_KEY.trim();

// Faucet / funding wallet on Base network
export const faucetWallet = new Wallet(pk, baseProvider);

// Legacy export for backward compatibility (deprecated - use faucetWallet instead)
export const faucetWalletEth = faucetWallet;

// Get balance of faucet wallet
export const getFaucetBalance = async (token = 'ETH') => {
  try {
    if (token === 'ETH' || token === 'AVAX') {
      const balance = await faucetWallet.getBalance();
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
    const ethBalance = await getFaucetBalance('ETH');
    logger.info(`Faucet ETH balance on Base: ${ethBalance.formatted}`);
  } catch (error) {
    logger.error('Error logging faucet info:', error);
  }
};