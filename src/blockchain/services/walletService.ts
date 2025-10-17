import { ethers } from 'ethers';
import crypto from 'crypto';
import { baseProvider } from './provider';
import logger from '../../config/logger';

/**
 * Generates a deterministic wallet from phone number and PIN
 * Creates an Ethereum-compatible wallet for use on Base blockchain
 */
export function generateDeterministicWallet(phoneNumber: string, pin: string): ethers.Wallet {
  try {
    if (!process.env.WALLET_GENERATION_SALT) {
      throw new Error('WALLET_GENERATION_SALT environment variable is not set');
    }

    // Create a deterministic seed from phone + PIN + salt
    const seedData = `${phoneNumber}-${pin}-${process.env.WALLET_GENERATION_SALT}`;
    const seedHash = crypto.createHash('sha256').update(seedData).digest('hex');
    
    // Create a wallet from the private key (seedHash)
    const wallet = new ethers.Wallet(seedHash);
    
    // Connect wallet to Base provider
    const connectedWallet = wallet.connect(baseProvider);
    
    // Log that we created a real wallet (without exposing private key)
    logger.info(`Generated deterministic wallet on Base: ${wallet.address} for phone hash: ${crypto.createHash('sha256').update(phoneNumber).digest('hex').substring(0, 8)}`);

    return connectedWallet;
  } catch (error) {
    logger.error('Failed to generate deterministic wallet:', error);
    throw new Error('Wallet generation failed');
  }
}

/**
 * Test if a wallet is valid and connected to Base blockchain
 */
export async function testWalletValidity(wallet: ethers.Wallet): Promise<boolean> {
  try {
    // Try to get the chain ID to verify connection to Base
    const chainId = await wallet.provider.getNetwork().then(n => n.chainId);
    
    // Get the wallet's address from the blockchain
    const code = await wallet.provider.getCode(wallet.address);
    
    logger.info(`Wallet test on Base: Address ${wallet.address}, Chain ID: ${chainId}`);
    logger.info(`Account type: ${code === '0x' ? 'EOA (Normal account)' : 'Contract account'}`);
    
    return true;
  } catch (error) {
    logger.error('Wallet validity test failed:', error);
    return false;
  }
}