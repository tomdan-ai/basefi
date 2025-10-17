import { ethers } from 'ethers';
import { generateDeterministicWallet } from './walletService';
import { provider } from './provider';
import logger from '../../config/logger';

// ABI for the meta-transaction function
const META_TX_ABI = [
  'function executeMetaTransaction(address userAddress, bytes functionData, bytes32 r, bytes32 s, uint8 v) returns (bytes)'
];

/**
 * Signs and executes a meta-transaction allowing users to transact without gas
 */
export const executeMetaTransaction = async (
  phoneNumber: string,
  pin: string,
  contractAddress: string,
  functionData: string // Encoded function call data
): Promise<ethers.providers.TransactionReceipt> => {
  try {
    // Get wallet from phone number and PIN
    const wallet = generateDeterministicWallet(phoneNumber, pin);
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, META_TX_ABI, provider);
    
    // Get current nonce for user
    const nonce = await contract.nonces(wallet.address);
    
    // Create signature
    const digest = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['address', 'uint256', 'address', 'bytes'],
        [wallet.address, nonce, contractAddress, functionData]
      )
    );
    
    const messageHash = ethers.utils.hashMessage(ethers.utils.arrayify(digest));
    const signature = await wallet.signMessage(ethers.utils.arrayify(digest));
    const { r, s, v } = ethers.utils.splitSignature(signature);
    
    // Execute meta-transaction through operator wallet
    const operatorWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contractWithSigner = contract.connect(operatorWallet);
    
    const tx = await contractWithSigner.executeMetaTransaction(
      wallet.address,
      functionData,
      r,
      s,
      v
    );
    
    return await tx.wait();
  } catch (error) {
    logger.error('Error executing meta-transaction:', error);
    throw error;
  }
};