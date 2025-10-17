import { simulateDepositProcessing } from '../services/depositProcessor';
import { connectToDatabase } from '../config/database';
import logger from '../config/logger';

async function main() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Process deposits
    logger.info('Starting manual deposit processing...');
    await simulateDepositProcessing();
    logger.info('Deposit processing completed');
    
    // Give time for logs to flush
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (error) {
    logger.error('Error in manual deposit processing:', error);
    process.exit(1);
  }
}

main();