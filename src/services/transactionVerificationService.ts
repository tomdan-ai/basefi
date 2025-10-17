import { ethers } from 'ethers';
import { avalancheProvider } from '../blockchain/services/provider';
import logger from '../config/logger';

/**
 * Verifies a transaction on the blockchain
 * @param txHash Transaction hash to verify
 * @returns Transaction receipt or null if not found
 */
export const verifyTransaction = async (
  txHash: string
): Promise<ethers.providers.TransactionReceipt | null> => {
  try {
    // Get transaction receipt
    const receipt = await avalancheProvider.getTransactionReceipt(txHash);
    
    if (receipt) {
      logger.info(`Transaction ${txHash} verified: Block #${receipt.blockNumber}, status: ${receipt.status === 1 ? 'success' : 'failed'}`);
    } else {
      logger.info(`Transaction ${txHash} not yet confirmed`);
    }
    
    return receipt;
  } catch (error) {
    logger.error(`Error verifying transaction ${txHash}:`, error);
    return null;
  }
};

/**
 * Waits for a transaction to be confirmed with a timeout
 * @param txHash Transaction hash to wait for
 * @param timeoutMs Maximum time to wait in milliseconds (default: 60000ms = 1min)
 * @param pollIntervalMs Polling interval in milliseconds (default: 5000ms = 5s)
 */
export const waitForTransaction = async (
  txHash: string,
  timeoutMs = 60000,
  pollIntervalMs = 5000
): Promise<ethers.providers.TransactionReceipt | null> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const receipt = await verifyTransaction(txHash);
    
    if (receipt) {
      return receipt;
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
  
  logger.warn(`Transaction ${txHash} not confirmed within timeout of ${timeoutMs}ms`);
  return null;
};