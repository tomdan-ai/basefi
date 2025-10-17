import logger from '../config/logger';
import { TransactionStatus } from '../models/transaction.model';

// Mock payment service for hackathon
export const initiateDeposit = async (
  amount: number, 
  phoneNumber: string, 
  reference?: string
): Promise<{ 
  reference: string; 
  status: TransactionStatus; 
  paymentUrl?: string 
}> => {
  try {
    // Generate a mock reference if not provided
    const txReference = reference || `mock-tx-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    logger.info(`Mock deposit initiated: ${amount} for ${phoneNumber}, ref: ${txReference}`);
    
    // For demo purposes, always return success
    return {
      reference: txReference,
      status: TransactionStatus.COMPLETED, // Auto-complete for demo
      paymentUrl: `https://mock-payment.example.com/${txReference}`
    };
  } catch (error) {
    logger.error('Error initiating mock deposit:', error);
    throw new Error('Failed to process deposit');
  }
};

export const verifyTransaction = async (reference: string): Promise<{
  status: TransactionStatus;
  amount?: number;
}> => {
  // For demo purposes, always return success
  logger.info(`Mock transaction verification: ${reference}`);
  return {
    status: TransactionStatus.COMPLETED,
    amount: 1000 // Mock amount
  };
};

export const initiateWithdrawal = async (
  amount: number,
  accountNumber: string,
  bankCode: string,
  reference?: string
): Promise<{
  reference: string;
  status: TransactionStatus;
}> => {
  // Generate a mock reference if not provided
  const txReference = reference || `mock-withdraw-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  logger.info(`Mock withdrawal initiated: ${amount} to account ${accountNumber}, bank: ${bankCode}, ref: ${txReference}`);
  
  // For demo purposes, always return success
  return {
    reference: txReference,
    status: TransactionStatus.COMPLETED
  };
};