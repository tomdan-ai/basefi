import express from 'express';
import mongoose from 'mongoose';
import * as tokenService from '../blockchain/services/tokenService';
import { 
  generateDeterministicWallet, 
  testWalletValidity
} from '../blockchain/services/walletService';

// Helper function to get wallet address from phone and PIN
const getWalletAddressFromPhoneAndPin = (phoneNumber: string, pin: string): string => {
  const wallet = generateDeterministicWallet(phoneNumber, pin);
  return wallet.address;
};
import { User } from '../models/user.model';
import Wallet from '../models/wallet.model';
import { Transaction, TransactionType, TransactionStatus } from '../models/transaction.model';
import logger from '../config/logger';
import crypto from 'crypto';
// Replace these mock service imports with real service imports
import { verifyTransaction, waitForTransaction } from '../services/transactionVerificationService';
import { encryptWallet, getWalletForTransaction } from '../blockchain/services/encryptionService';
import { mintFujiUSDC } from '../services/faucetService';
import { faucetWallet } from '../config/wallet';
import { transferFromWallet } from '../blockchain/services/tokenService';
import { ethers } from 'ethers';
import { avalancheProvider } from '../blockchain/services/provider';
import { requestFiatPayout } from '../services/payoutService';

// USSD Menu States
enum MenuState {
  MAIN = 'MAIN',
  CHECK_BALANCE = 'CHECK_BALANCE',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  CONFIRM_TRANSACTION = 'CONFIRM_TRANSACTION',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  SET_PIN = 'SET_PIN',
  ENTER_PIN = 'ENTER_PIN',
  ENTER_BANK_DETAILS = 'ENTER_BANK_DETAILS',
  ENTER_ACCOUNT_NUMBER = 'ENTER_ACCOUNT_NUMBER',
  CONFIRM_WITHDRAWAL = 'CONFIRM_WITHDRAWAL'
}

// Session storage (in-memory for demo)
const sessions: Record<string, any> = {};

// Simple session cleanup (run every hour)
setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(sessionId => {
    if (now - sessions[sessionId].lastActivity > 3600000) { // 1 hour
      delete sessions[sessionId];
    }
  });
}, 3600000);

// Hash PIN for secure storage - in production use bcrypt or argon2
const hashPin = (pin: string): string => {
  return crypto.createHash('sha256').update(pin).digest('hex');
};

export const handleUSSD = async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    logger.debug(`USSD request: ${JSON.stringify({ sessionId, serviceCode, phoneNumber, text })}`);
    
    // Initialize session if new
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        state: MenuState.MAIN,
        data: {},
        phoneNumber,
        lastActivity: Date.now()
      };
      
      try {
        // Hash the phone number for lookup
        const phoneHash = crypto.createHash('sha256').update(phoneNumber).digest('hex');
        logger.debug(`Looking up user with phoneHash: ${phoneHash}`);
        
        // Check if user exists by phone hash
        const user = await User.findOne({ phoneNumber: phoneHash }).exec();
        
        if (!user) {
          logger.debug(`No user found with phoneHash: ${phoneHash}, creating new account`);
          sessions[sessionId].state = MenuState.CREATE_ACCOUNT;
        } else {
          logger.debug(`Found user: ${user._id} with phoneHash: ${phoneHash}`);
          sessions[sessionId].user = user;
          
          // Get user's wallet - ensure userId is a valid ObjectId
          try {
            // Fix the typing by explicitly handling the user._id type
            const wallet = await Wallet.findOne({ 
              userId: user._id  // This works because userId in schema references User model
            }).exec();
            
            if (wallet) {
              logger.debug(`Found wallet for user: ${wallet.walletAddress}`);
              sessions[sessionId].wallet = wallet;
            } else {
              logger.warn(`No wallet found for user: ${user._id}`);
              // If no wallet is found but user exists, attempt to recover
              const defaultPin = '0000'; // Placeholder - we'll ask for PIN later
              const walletAddress = user.walletAddress || 
                getWalletAddressFromPhoneAndPin(phoneNumber, defaultPin);
              
              // Create a placeholder wallet for now
              if (walletAddress) {
                const newWallet = await Wallet.create({
                  userId: user._id,
                  walletAddress: walletAddress,
                  currency: 'USDC.e'
                });
                sessions[sessionId].wallet = newWallet;
                logger.info(`Created recovery wallet for user: ${user._id}`);
              }
            }
          } catch (walletError) {
            logger.error(`Error retrieving wallet: ${walletError}`);
            // Continue with session even if wallet lookup fails
          }
        }
      } catch (error) {
        logger.error(`Error initializing session: ${error}`);
        // Default to create account if there's an error
        sessions[sessionId].state = MenuState.CREATE_ACCOUNT;
      }
    } else {
      // Update last activity
      sessions[sessionId].lastActivity = Date.now();
    }
    
    const session = sessions[sessionId];
    let response = '';
    
    // If we're in MAIN state but don't have user/wallet, go to CREATE_ACCOUNT
    if (session.state === MenuState.MAIN && (!session.user || !session.wallet)) {
      session.state = MenuState.CREATE_ACCOUNT;
    }
    
    // Process based on current state and input
    switch (session.state) {
      case MenuState.CREATE_ACCOUNT:
        // Create new user and wallet
        if (text === '') {
          response = 'CON Welcome to Avanomad\n';
          response += 'You need to create an account first\n';
          response += '1. Create account';
        } else if (text === '1') {
          session.state = MenuState.SET_PIN;
          response = 'CON Please set a 4-digit PIN for your account:';
        }
        break;
        
      case MenuState.SET_PIN:
        // Validate and set PIN
        if (text.length >= 4) {
          const pin = text.split('*').pop();
          
          if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
            try {
              // Generate deterministic wallet from phone number and PIN
              const wallet = generateDeterministicWallet(phoneNumber, pin);
              
              // Log the full wallet address to verify it's correct
              logger.info(`Created wallet address: ${wallet.address} with provider: ${wallet.provider ? 'Connected' : 'Not connected'}`);
              
              const hashedPin = hashPin(pin);
              
              // Create user in database
              const phoneHash = crypto.createHash('sha256').update(phoneNumber).digest('hex');
              
              const newUser = await User.create({
                phoneNumber: phoneHash,
                pin: hashedPin,
                walletAddress: wallet.address
              });
              
              // Encrypt the wallet's private key
              const encryptedKey = await encryptWallet(wallet, pin);
              
              // Create and save the wallet with encrypted key
              const newWallet = await Wallet.create({
                userId: newUser._id,
                walletAddress: wallet.address,
                encryptedKey: encryptedKey,
                currency: 'USDC.e'
              });
              
              // Additional debugging
              logger.info(`Wallet saved to DB with ID: ${newWallet._id}`);
              
              session.user = newUser;
              session.wallet = newWallet;
              session.state = MenuState.MAIN;
              
              // Test if wallet is valid
              const isValid = await testWalletValidity(wallet);
              
              // Include in the response:
              response = 'END Account created successfully!\n';
              response += `Your wallet address: ${wallet.address}\n`;
              response += `Blockchain connection: ${isValid ? 'VERIFIED ✓' : 'FAILED ✗'}\n`;
              response += 'Remember your PIN - it\'s needed to access your wallet!';
            } catch (error) {
              // Handle error properly with type checking
              logger.error('Error creating account:', error instanceof Error ? error.message : 'Unknown error');
              response = 'END Failed to create account. Please try again.';
              session.state = MenuState.CREATE_ACCOUNT;
            }
          } else {
            response = 'CON Invalid PIN. Please enter a 4-digit PIN:';
          }
        } else {
          response = 'CON Please enter a 4-digit PIN:';
        }
        break;
        
      case MenuState.MAIN:
        // Main menu
        if (text === '') {
          response = 'CON Welcome back to Avanomad\n';
          response += '1. Check Balance\n';
          response += '2. Deposit Funds\n';
          response += '3. Withdraw Funds\n';
          response += '4. Transfer Funds';
        } else {
          const choice = text.split('*').pop();
          
          switch (choice) {
            case '1':
              session.state = MenuState.CHECK_BALANCE;
              response = 'CON Enter PIN to check balance:';
              break;
            case '2':
              session.state = MenuState.DEPOSIT;
              response = 'CON Enter amount to deposit (in local currency):';
              break;
            case '3':
              session.state = MenuState.WITHDRAW;
              response = 'CON Enter amount to withdraw (in USDC.e):';
              break;
            case '4':
              session.state = MenuState.TRANSFER;
              response = 'CON Enter recipient phone number:';
              break;
            default:
              response = 'CON Invalid option. Please try again.\n';
              response += '1. Check Balance\n';
              response += '2. Deposit Funds\n';
              response += '3. Withdraw Funds\n';
              response += '4. Transfer Funds';
          }
        }
        break;
        
      case MenuState.CHECK_BALANCE:
        // Check balance using deterministic wallet
        try {
          const pin = text.split('*').pop() || '';
          
          // Regenerate wallet from phone number and PIN
          const wallet = generateDeterministicWallet(phoneNumber, pin);
          
          // Get AVAX balance first (native token)
          const avaxBalance = ethers.utils.formatEther(
            await avalancheProvider.getBalance(wallet.address)
          );
          
          // Try to get USDC.e balance
          let usdcBalance = "0.0";
          try {
            usdcBalance = await tokenService.getBalance('USDC.e', wallet.address);
          } catch (tokenError) {
            logger.warn(`Error getting USDC.e balance: ${tokenError}`);
          }
          
          response = 'END Your balance:\n';
          response += `AVAX: ${avaxBalance}\n`;
          response += `USDC.e: ${usdcBalance}\n`;  
          response += `Address: ${wallet.address}`;
          
          // Log with just a wallet address for privacy
          const phoneHash = crypto.createHash('sha256').update(phoneNumber).digest('hex');
          logger.info(`Balance checked for ${phoneHash}`);
          
          session.state = MenuState.MAIN;
        } catch (error) {
          logger.error('Error checking balance:', error);
          response = 'END An error occurred while checking your balance. Please try again.';
          session.state = MenuState.MAIN;
        }
        break;

      case MenuState.DEPOSIT:
        if (text.split('*').length === 2) { // After entering amount
          const amount = parseFloat(text.split('*').pop() || '0');
          if (isNaN(amount) || amount <= 0) {
            response = 'CON Invalid amount. Please enter a valid amount:';
          } else {
            session.data.depositAmount = amount;
            session.state = MenuState.ENTER_PIN;
            session.data.nextState = MenuState.CONFIRM_TRANSACTION;
            session.data.transactionType = TransactionType.DEPOSIT;
            response = 'CON Enter your PIN to confirm deposit:';
          }
        } else {
          response = 'CON Enter amount to deposit (in local currency):';
        }
        break;

      case MenuState.WITHDRAW:
        if (text.split('*').length === 2) { // After entering amount
          const amount = parseFloat(text.split('*').pop() || '0');
          if (isNaN(amount) || amount <= 0) {
            response = 'CON Invalid amount. Please enter a valid amount:';
          } else {
            session.data.withdrawAmount = amount;
            
            // Calculate approximate NGN value
            const exchangeRate = 1200; // 1 USDC.e ≈ 1200 NGN (example rate)
            const ngnAmount = (amount * exchangeRate).toFixed(2);
            
            session.data.withdrawNgnAmount = ngnAmount;
            
            // First get PIN before bank details
            session.state = MenuState.ENTER_PIN;
            session.data.nextState = MenuState.ENTER_BANK_DETAILS;
            session.data.transactionType = TransactionType.WITHDRAWAL;
            response = 'CON Enter your PIN to proceed:';
          }
        } else {
          response = 'CON Enter amount to withdraw (in USDC.e):';
        }
        break;

      case MenuState.TRANSFER:
        const parts = text.split('*');
        
        if (parts.length === 2) { // Just entered recipient phone number
          const recipientPhone = parts[1];
          
          // Validate phone number format
          if (!/^\d{10,15}$/.test(recipientPhone)) {
            response = 'CON Invalid phone number. Please enter a valid phone number:';
            break;
          }
          
          // Store recipient phone in session
          session.data.recipientPhone = recipientPhone;
          
          // Look up recipient in the database
          try {
            // Hash the recipient phone for lookup
            const recipientPhoneHash = crypto.createHash('sha256').update(recipientPhone).digest('hex');
            const recipient = await User.findOne({ phoneNumber: recipientPhoneHash }).exec();
            
            if (!recipient) {
              response = 'END Recipient not found. They need to create an Avanomad account first.';
              session.state = MenuState.MAIN;
              break;
            }
            
            // Get recipient's wallet
            const recipientWallet = await Wallet.findOne({ userId: recipient._id }).exec();
            if (!recipientWallet) {
              response = 'END Recipient wallet not found. Please try again later.';
              session.state = MenuState.MAIN;
              break;
            }
            
            // Store recipient info for the transaction
            session.data.recipientUserId = recipient._id;
            session.data.recipientWalletAddress = recipientWallet.walletAddress;
            
            // Ask for transfer amount
            response = 'CON Enter amount to transfer (in USDC.e):';
          } catch (error) {
            logger.error('Error looking up recipient:', error);
            response = 'END An error occurred while finding the recipient. Please try again.';
            session.state = MenuState.MAIN;
          }
        } else if (parts.length === 3) { // Entered amount after recipient
          const amount = parseFloat(parts[2]);
          
          if (isNaN(amount) || amount <= 0) {
            response = 'CON Invalid amount. Please enter a valid amount:';
            break;
          }
          
          // Store transfer amount
          session.data.transferAmount = amount;
          
          // Move to PIN entry
          session.state = MenuState.ENTER_PIN;
          session.data.nextState = MenuState.CONFIRM_TRANSACTION;
          session.data.transactionType = TransactionType.TRANSFER;
          response = 'CON Enter your PIN to confirm transfer:';
        } else {
          response = 'CON Enter recipient phone number:';
        }
        break;

      case MenuState.ENTER_PIN:
        const pin = text.split('*').pop() || '';
        
        if (pin.length === 4 && /^\d+$/.test(pin)) {
          const wallet = generateDeterministicWallet(phoneNumber, pin);
          
          // Verify wallet ownership - check against stored address or derive address
          const walletAddress = session.wallet?.walletAddress;
          
          if (walletAddress && wallet.address.toLowerCase() === walletAddress.toLowerCase()) {
            // Store PIN for later use regardless of flow
            session.data.pin = pin;
            
            if (session.data.nextState === MenuState.CONFIRM_TRANSACTION) {
              session.state = MenuState.CONFIRM_TRANSACTION;
              
              if (session.data.transactionType === TransactionType.DEPOSIT) {
                response = `CON Confirm deposit of ${session.data.depositAmount} to your wallet:\n`;
                response += '1. Confirm\n';
                response += '2. Cancel';
              } else if (session.data.transactionType === TransactionType.TRANSFER) {
                response = `CON Confirm transfer of ${session.data.transferAmount} USDC.e to ${session.data.recipientPhone}:\n`;
                response += '1. Confirm\n';
                response += '2. Cancel';
              }
            } else if (session.data.nextState === MenuState.ENTER_BANK_DETAILS) {
              // This is the withdrawal flow
              session.state = MenuState.ENTER_BANK_DETAILS;
              
              // Set bank selection menu here directly
              response = 'CON Select your bank:\n';
              response += '1. Access Bank\n';
              response += '2. Guaranty Trust Bank\n';
              response += '3. First Bank\n';
              response += '4. United Bank for Africa\n';
              response += '5. Zenith Bank\n';
              response += '9. More banks';
            } else {
              session.state = session.data.nextState || MenuState.MAIN;
            }
          } else {
            response = 'END Incorrect PIN. Please try again.';
            session.state = MenuState.MAIN;
          }
        } else {
          response = 'CON Invalid PIN. Please enter a 4-digit PIN:';
        }
        break;

      case MenuState.CONFIRM_TRANSACTION:
        const choice = text.split('*').pop();
        
        if (choice === '1') { // Confirm
          try {
            if (session.data.transactionType === TransactionType.DEPOSIT) {
              try {
                // Generate deterministic wallet for the transaction using the PIN from the session
                const wallet = generateDeterministicWallet(phoneNumber, session.data.pin);
                
                // Use real faucet to send USDC.e to user's wallet
                const { receipt, gasReceipt } = await mintFujiUSDC(
                  wallet.address,
                  session.data.depositAmount.toString()
                );
                
                // Create transaction record with blockchain transaction hash
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.depositAmount,
                  currency: 'NGN', // Original currency
                  type: TransactionType.DEPOSIT,
                  status: TransactionStatus.COMPLETED,
                  reference: receipt.transactionHash, // Use actual blockchain tx hash as reference
                  walletAddress: session.wallet.walletAddress,
                  blockNumber: receipt.blockNumber,
                  blockchainTxHash: receipt.transactionHash
                });
                
                // If we also funded gas, record it as a separate transaction
                if (gasReceipt) {
                  await Transaction.create({
                    userId: session.user._id,
                    amount: 0.05, // Standard gas amount
                    currency: 'USDC.e',
                    type: TransactionType.DEPOSIT,
                    status: TransactionStatus.COMPLETED,
                    reference: gasReceipt.transactionHash, // Use actual blockchain tx hash as reference
                    walletAddress: session.wallet.walletAddress,
                    blockNumber: gasReceipt.blockNumber,
                    blockchainTxHash: gasReceipt.transactionHash
                  });
                }
                
                response = 'END Deposit successful!\n';
                response += `Amount: ${session.data.depositAmount} USDC.e\n`;
                response += `Transaction: ${receipt.transactionHash}`;
                
              } catch (error: unknown) {
                logger.error('Error processing deposit:', error);
                response = 'END Deposit failed. Please try again later.\n';
                // Fix 1: Check if error is an object with a message property
                response += 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
                
                // Create failed transaction record
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.depositAmount,
                  currency: 'NGN',
                  type: TransactionType.DEPOSIT,
                  status: TransactionStatus.FAILED,
                  reference: `failed-${Date.now()}`,
                  walletAddress: session.wallet.walletAddress,
                  // Fix 2: Same pattern for failureReason
                  failureReason: error instanceof Error ? error.message : 'Unknown error'
                });
              }
            } else if (session.data.transactionType === TransactionType.WITHDRAWAL) {
              try {
                // Get signing wallet using pin from session
                const wallet = await getWalletForTransaction(
                  phoneNumber,
                  session.data.pin,
                  session.wallet.encryptedKey
                );
                
                // Destination address could be your treasury wallet or another address
                const treasuryAddress = process.env.TREASURY_ADDRESS || faucetWallet.address;
                
                // Execute the withdrawal as a transfer from user's wallet to treasury
                const receipt = await transferFromWallet(
                  'USDC.e',
                  wallet,
                  treasuryAddress,
                  session.data.withdrawAmount.toString()
                );
                
                // Create transaction record
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.withdrawAmount,
                  currency: 'USDC.e',
                  type: TransactionType.WITHDRAWAL,
                  status: TransactionStatus.COMPLETED,
                  reference: receipt.transactionHash,
                  walletAddress: session.wallet.walletAddress,
                  blockNumber: receipt.blockNumber,
                  blockchainTxHash: receipt.transactionHash
                });
                
                response = 'END Withdrawal successful!\n';
                response += `Amount: ${session.data.withdrawAmount} USDC.e\n`;
                response += `Transaction: ${receipt.transactionHash}`;
                
              } catch (error) {
                logger.error('Error processing withdrawal:', error);
                
                // Create failed transaction record
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.withdrawAmount,
                  currency: 'USDC.e',
                  type: TransactionType.WITHDRAWAL,
                  status: TransactionStatus.FAILED,
                  reference: `failed-${Date.now()}`,
                  walletAddress: session.wallet.walletAddress,
                  failureReason: error instanceof Error ? error.message : 'Unknown error'
                });
                
                response = 'END Withdrawal failed. Please try again later.\n';
                response += 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
              }
            } else if (session.data.transactionType === TransactionType.TRANSFER) {
              try {
                // Get signing wallet using pin from session
                const wallet = await getWalletForTransaction(
                  phoneNumber,
                  session.data.pin,
                  session.wallet.encryptedKey
                );
                
                // Execute the transfer from user's wallet to recipient's wallet
                const receipt = await transferFromWallet(
                  'USDC.e',
                  wallet,
                  session.data.recipientWalletAddress,
                  session.data.transferAmount.toString()
                );
                
                // Create transaction record for sender
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.transferAmount,
                  currency: 'USDC.e',
                  type: TransactionType.TRANSFER,
                  status: TransactionStatus.COMPLETED,
                  reference: receipt.transactionHash,
                  walletAddress: session.wallet.walletAddress,
                  recipientWalletAddress: session.data.recipientWalletAddress,
                  blockNumber: receipt.blockNumber,
                  blockchainTxHash: receipt.transactionHash
                });
                
                // Create transaction record for recipient (as a receive)
                await Transaction.create({
                  userId: session.data.recipientUserId,
                  amount: session.data.transferAmount,
                  currency: 'USDC.e',
                  type: TransactionType.RECEIVE,
                  status: TransactionStatus.COMPLETED,
                  reference: receipt.transactionHash,
                  walletAddress: session.data.recipientWalletAddress,
                  senderWalletAddress: session.wallet.walletAddress,
                  blockNumber: receipt.blockNumber,
                  blockchainTxHash: receipt.transactionHash
                });
                
                response = 'END Transfer successful!\n';
                response += `Amount: ${session.data.transferAmount} USDC.e\n`;
                response += `To: ${session.data.recipientPhone.substring(0, 4)}****${session.data.recipientPhone.substring(session.data.recipientPhone.length - 2)}\n`;
                response += `Transaction: ${receipt.transactionHash}`;
                
              } catch (error) {
                logger.error('Error processing transfer:', error);
                
                // Create failed transaction record
                await Transaction.create({
                  userId: session.user._id,
                  amount: session.data.transferAmount,
                  currency: 'USDC.e',
                  type: TransactionType.TRANSFER,
                  status: TransactionStatus.FAILED,
                  reference: `failed-${Date.now()}`,
                  walletAddress: session.wallet.walletAddress,
                  recipientWalletAddress: session.data.recipientWalletAddress,
                  failureReason: error instanceof Error ? error.message : 'Unknown error'
                });
                
                response = 'END Transfer failed. Please try again later.\n';
                response += 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
              }
            }
          } catch (error) {
            logger.error('Error confirming transaction:', error);
            response = 'END An error occurred while processing your request. Please try again.';
          }
        } else {
          // Cancel or invalid choice
          response = 'END Transaction cancelled.';
          session.state = MenuState.MAIN;
        }
        break;

      case MenuState.ENTER_BANK_DETAILS:
        response = 'CON Select your bank:\n';
        response += '1. Access Bank\n';
        response += '2. Guaranty Trust Bank\n';
        response += '3. First Bank\n';
        response += '4. United Bank for Africa\n';
        response += '5. Zenith Bank\n';
        response += '9. More banks';
        
        session.state = MenuState.ENTER_ACCOUNT_NUMBER;
        break;

      case MenuState.ENTER_ACCOUNT_NUMBER:
        const bankChoice = text.split('*').pop() || '';
        
        // Map bank choice to code
        const bankCodes = {
          '1': '044', // Access Bank
          '2': '058', // GTBank
          '3': '011', // First Bank
          '4': '033', // UBA
          '5': '057'  // Zenith Bank
        };
        
        if (!bankCodes[bankChoice as keyof typeof bankCodes]) {
          response = 'END Invalid bank selection. Please try again.';
          session.state = MenuState.MAIN;
          break;
        }
        
        session.data.bankCode = bankCodes[bankChoice as keyof typeof bankCodes];
        response = 'CON Enter your account number:';
        session.state = MenuState.CONFIRM_WITHDRAWAL;
        break;

      case MenuState.CONFIRM_WITHDRAWAL:
        // First part is collecting the account number
        if (!session.data.accountNumber) {
          const accountNumber = text.split('*').pop() || '';
          
          if (!/^\d{10}$/.test(accountNumber)) {
            response = 'CON Invalid account number. Please enter a 10-digit account number:';
            break;
          }
          
          session.data.accountNumber = accountNumber;
          
          // Show final confirmation
          response = `CON Confirm withdrawal of ${session.data.withdrawAmount} USDC.e (≈${session.data.withdrawNgnAmount} NGN)\n`;
          response += `to Account: ${accountNumber}\n`;
          response += '1. Confirm\n';
          response += '2. Cancel';
          break;
        }
        
        // Second part is confirming the transaction
        const withdrawalChoice = text.split('*').pop();
        
        if (withdrawalChoice === '1') { // Confirm
          try {
            // 1. Get user's wallet and transfer USDC to treasury
            const wallet = await getWalletForTransaction(
              phoneNumber,
              session.data.pin,
              session.wallet.encryptedKey
            );
            
            const treasuryAddress = process.env.TREASURY_ADDRESS || faucetWallet.address;
            
            // Execute the blockchain transaction
            const receipt = await transferFromWallet(
              'USDC.e',
              wallet,
              treasuryAddress,
              session.data.withdrawAmount.toString()
            );
            
            // 2. Record blockchain transaction
            await Transaction.create({
              userId: session.user._id,
              amount: session.data.withdrawAmount,
              currency: 'USDC.e',
              type: TransactionType.WITHDRAWAL,
              status: TransactionStatus.COMPLETED,
              reference: receipt.transactionHash,
              walletAddress: session.wallet.walletAddress,
              blockNumber: receipt.blockNumber,
              blockchainTxHash: receipt.transactionHash
            });
            
            // 3. Initiate fiat payout to user's bank account
            const payoutResponse = await requestFiatPayout(
              session.user._id.toString(),
              parseFloat(session.data.withdrawNgnAmount),
              session.data.bankCode,
              session.data.accountNumber,
              phoneNumber
            );
            
            response = 'END Withdrawal initiated successfully!\n';
            response += `Amount: ${session.data.withdrawAmount} USDC.e (≈${session.data.withdrawNgnAmount} NGN)\n`;
            response += `Account: ${session.data.accountNumber}\n`;
            response += `Reference: ${payoutResponse.reference}\n`;
            response += 'Your bank account will be credited shortly.';
            
          } catch (error) {
            logger.error('Error processing withdrawal:', error);
            
            // Create failed transaction record
            await Transaction.create({
              userId: session.user._id,
              amount: session.data.withdrawAmount,
              currency: 'USDC.e',
              type: TransactionType.WITHDRAWAL,
              status: TransactionStatus.FAILED,
              reference: `failed-${Date.now()}`,
              walletAddress: session.wallet.walletAddress,
              failureReason: error instanceof Error ? error.message : 'Unknown error'
            });
            
            response = 'END Withdrawal failed. Please try again later.\n';
            response += 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
          }
        } else {
          // Cancel
          response = 'END Withdrawal cancelled.';
        }
        session.state = MenuState.MAIN;
        break;
    }
    
    // Send response back to USSD gateway
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    logger.error('Error handling USSD request:', error);
    res.status(500).send('END An unexpected error occurred. Please try again later.');
  }
};

// Helper function to get signing wallet (for withdrawals)
// Helper function to get signing wallet (for withdrawals)
async function getSigningWallet(phoneNumber: string, pin: string, encryptedKey: string) {
  // Decrypt the wallet's private key using the PIN
  const wallet = await decryptWallet(encryptedKey, pin);
  return wallet;
}

// Helper function to decrypt wallet (using PIN)
// In production, use a more secure key management solution
async function decryptWallet(encryptedKey: string, pin: string) {
  // For demo, just return the wallet directly - in reality, decrypt using key derivation from PIN
  return JSON.parse(Buffer.from(encryptedKey, 'base64').toString('utf-8'));
}
// Helper function to transfer from wallet (for withdrawals)
// In production, replace with real blockchain transfer logic
// async function transferFromWallet(currency: string, fromWallet: any, toAddress: string, amount: string) {
//   logger.info(`Transferring ${amount} ${currency} from wallet ${fromWallet.address} to ${toAddress}`);
  
//   // Simulate successful transfer - in reality, call blockchain transfer API
//   return {
//     transactionHash: crypto.randomBytes(16).toString('hex'),
//     blockNumber: 123456
//   };
// }
