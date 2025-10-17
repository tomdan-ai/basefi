import { ethers } from 'ethers';
import { baseProvider } from '../blockchain/services/provider';
import { faucetWallet } from '../config/wallet';
import logger from '../config/logger';

// ERC20 ABI with mint function
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function mint(address to, uint256 amount) returns (bool)'
];

// Token addresses - should match what's in tokenService.ts
const TOKENS: Record<string, string> = {
  'bUSD': process.env.TOKEN_ADDRESS || '0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C',  // BaseFi USD token
  'USDC': '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Native USDC on Base
};

/**
 * Fund a wallet with bUSD tokens on Base by minting new tokens
 */
export const mintBaseFiUSD = async (
  to: string,
  amountLocal: string,
  shouldFundGas = true
): Promise<{
  receipt: ethers.providers.TransactionReceipt,
  gasReceipt?: ethers.providers.TransactionReceipt
}> => {
  try {
    // First fund with gas if needed
    let gasReceipt;
    if (shouldFundGas) {
      try {
        gasReceipt = await fundBaseETH(to, '0.001'); // Smaller amount on Base (lower fees)
        logger.info(`Funded ${to} with gas: ${gasReceipt.transactionHash}`);
      } catch (gasError) {
        const errorMessage = gasError instanceof Error ? gasError.message : String(gasError);
        logger.warn(`Failed to fund gas: ${errorMessage}`);
      }
    }
    
    // Convert local currency to USD (simplified conversion)
    const exchangeRate = 0.00083; // 1 NGN ≈ 0.00083 USD
    const usdAmount = (parseFloat(amountLocal) * exchangeRate).toFixed(6);
    
    logger.info(`Converting ${amountLocal} local currency to ${usdAmount} bUSD`);
    
    // Get token contract address
    const tokenAddress = TOKENS['bUSD'];
    if (!tokenAddress) {
      throw new Error('Token address not configured');
    }
    
    // Create contract instance with admin wallet for minting
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, faucetWallet);
    
    // Get decimals
    const decimals = await tokenContract.decimals();
    logger.info(`Token decimals: ${decimals}`);
    
    // Calculate amount with proper decimals
    const amount = ethers.utils.parseUnits(usdAmount, decimals);
    
    // Mint tokens directly to user's wallet
    logger.info(`Minting ${usdAmount} bUSD to ${to}`);
    const tx = await tokenContract.mint(to, amount);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    logger.info(`Token minting completed on Base: ${receipt.transactionHash}`);
    
    return { receipt, gasReceipt };
  } catch (error) {
    logger.error('Error minting tokens:', error);
    throw new Error(`Failed to mint tokens: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Legacy export for backward compatibility
export const mintFujiUSDC = mintBaseFiUSD;

/**
 * Fund a wallet with Base ETH for gas fees
 */
function fundBaseETH(to: string, amount: string): Promise<ethers.providers.TransactionReceipt> {
  try {
    const tx = faucetWallet.sendTransaction({
      to: to,
      value: ethers.utils.parseEther(amount)
    });
    return tx.then(t => t.wait());
  } catch (error) {
    logger.error('Error funding ETH:', error);
    throw new Error(`Failed to fund ETH: ${error instanceof Error ? error.message : String(error)}`);
  }
}
// Rest of your faucetService.ts code...