import { ethers } from 'ethers';
import crypto from 'crypto';
import logger from '../../config/logger';
import { generateDeterministicWallet } from './walletService';
import { avalancheProvider } from './provider';

/**
 * Encrypts a wallet's private key using the PIN as password
 */
export const encryptWallet = async (
  wallet: ethers.Wallet,
  pin: string
): Promise<string> => {
  try {
    // Use lighter scrypt parameters for faster USSD response
    const options = {
      scrypt: {
        N: 8192,  // Default is 131072, reduced for USSD response time
      }
    };
    
    // Combine PIN with app salt for stronger encryption
    const encryptionPassword = `${pin}-${process.env.WALLET_GENERATION_SALT}`;
    
    // Encrypt the wallet
    const encryptedJson = await wallet.encrypt(encryptionPassword, options);
    return encryptedJson;
  } catch (error) {
    logger.error('Error encrypting wallet:', error);
    throw new Error('Failed to encrypt wallet');
  }
};

/**
 * Decrypts a wallet using the PIN
 */
export const decryptWallet = async (
  encryptedJson: string,
  pin: string
): Promise<ethers.Wallet> => {
  try {
    // Validate that the encrypted data looks like JSON
    if (!encryptedJson || !encryptedJson.startsWith('{')) {
      throw new Error('Invalid encrypted wallet format');
    }
    
    const encryptionPassword = `${pin}-${process.env.WALLET_GENERATION_SALT}`;
    return await ethers.Wallet.fromEncryptedJson(encryptedJson, encryptionPassword);
  } catch (error) {
    logger.error('Error decrypting wallet:', error);
    throw new Error('Failed to decrypt wallet');
  }
};

/**
 * Gets a wallet either from encrypted storage or by regenerating it
 * More reliable version that handles decryption failures
 */
export const getWalletForTransaction = async (
  phoneNumber: string,
  pin: string,
  encryptedKey?: string
): Promise<ethers.Wallet> => {
  try {
    // If we have what appears to be a valid encrypted key, try to use it
    if (encryptedKey && encryptedKey.startsWith('{') && encryptedKey.includes('ciphertext')) {
      try {
        const wallet = await decryptWallet(encryptedKey, pin);
        return wallet.connect(avalancheProvider);
      } catch (decryptError) {
        logger.warn('Decryption failed, falling back to deterministic generation:', decryptError);
      }
    }
    
    // Fall back to deterministic generation
    logger.info('Using deterministic wallet generation');
    return generateDeterministicWallet(phoneNumber, pin);
  } catch (error) {
    logger.error('Error getting wallet for transaction:', error);
    throw new Error('Could not access your wallet. Please check your PIN.');
  }
};