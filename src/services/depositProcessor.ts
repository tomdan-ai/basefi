import { Transaction, TransactionStatus, TransactionType } from '../models/transaction.model';
import * as tokenService from '../blockchain/services/tokenService';
import { User } from '../models/user.model';
import Wallet from '../models/wallet.model';
import logger from '../config/logger';
import { ethers } from 'ethers';
import { getWallet } from '../blockchain/services/provider';

// Mock exchange rate (for demo purposes)
const NGN_TO_USDC_RATE = 0.0005; // 1 NGN = 0.0005 USDC

/**
 * Process pending deposits and send USDC.e to users
 */
export const processDeposits = async (): Promise<void> => {
  try {
    // Find all completed deposits that haven't been processed
    const pendingDeposits = await Transaction.find({
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      txHash: { $exists: false } // No txHash means it hasn't been processed on-chain
    }).exec();

    if (pendingDeposits.length === 0) {
      logger.debug('No pending deposits to process');
      return;
    }

    logger.info(`Processing ${pendingDeposits.length} pending deposits`);

    // Get the admin wallet for sending tokens
    const adminWallet = getWallet();
    
    // Process each deposit
    for (const deposit of pendingDeposits) {
      try {
        // Convert NGN to USDC.e
        const usdcAmount = (deposit.amount * NGN_TO_USDC_RATE).toFixed(6);
        logger.info(`Converting ${deposit.amount} NGN to ${usdcAmount} USDC.e for user ${deposit.userId}`);

        // Get user wallet address
        const wallet = await Wallet.findOne({ userId: deposit.userId }).exec();
        if (!wallet) {
          logger.error(`No wallet found for user ${deposit.userId}`);
          continue;
        }

        // Transfer USDC.e to user's wallet
        const tx = await tokenService.transfer('USDC.e', wallet.walletAddress, usdcAmount);
        
        // Update transaction with blockchain txHash
        deposit.txHash = tx.transactionHash;
        deposit.status = TransactionStatus.COMPLETED;
        await deposit.save();

        logger.info(`Processed deposit: ${usdcAmount} USDC.e sent to ${wallet.walletAddress}, txHash: ${tx.transactionHash}`);
      } catch (error) {
        logger.error(`Error processing deposit ${deposit._id}:`, error);
      }
    }
  } catch (error) {
    logger.error('Error in deposit processor:', error);
  }
};

/**
 * For hackathon demo: Simulate token transfer without actual blockchain interaction
 */
export const simulateDepositProcessing = async (): Promise<void> => {
  try {
    // Find all completed deposits that haven't been processed
    const pendingDeposits = await Transaction.find({
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      txHash: { $exists: false }
    }).exec();

    if (pendingDeposits.length === 0) {
      logger.debug('No pending deposits to simulate');
      return;
    }

    logger.info(`Simulating processing for ${pendingDeposits.length} pending deposits`);

    // Process each deposit
    for (const deposit of pendingDeposits) {
      try {
        // Convert NGN to USDC.e
        const usdcAmount = (deposit.amount * NGN_TO_USDC_RATE).toFixed(6);
        logger.info(`[SIMULATION] Converting ${deposit.amount} NGN to ${usdcAmount} USDC.e for user ${deposit.userId}`);

        // Generate mock transaction hash
        const mockTxHash = ethers.utils.id(`deposit-${deposit._id}-${Date.now()}`);
        
        // Update transaction with mock blockchain txHash
        deposit.txHash = mockTxHash;
        deposit.status = TransactionStatus.COMPLETED;
        await deposit.save();

        logger.info(`[SIMULATION] Processed deposit: ${usdcAmount} USDC.e, mock txHash: ${mockTxHash}`);
      } catch (error) {
        logger.error(`Error simulating deposit ${deposit._id}:`, error);
      }
    }
  } catch (error) {
    logger.error('Error in deposit simulator:', error);
  }
};