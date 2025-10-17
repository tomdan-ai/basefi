// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title BaseFiWallet
 * @dev Smart contract wallet for BaseFi USSD platform on Base blockchain
 * @notice Enables gasless transactions through meta-transactions for USSD users
 * Allows operators to execute transactions on behalf of users who sign with their
 * deterministic wallets (generated from phone number + PIN)
 */
contract BaseFiWallet is Ownable {
    using ECDSA for bytes32;
    
    // Operator permissions mapping
    mapping(address => bool) public operators;
    
    // Nonces for meta-transactions (prevents replay attacks)
    mapping(address => uint256) public nonces;
    
    // Events
    event Deposit(address indexed token, address indexed from, uint256 amount);
    event Withdrawal(address indexed token, address indexed to, uint256 amount);
    event MetaTransaction(address indexed user, address indexed executor, bytes action);
    event OperatorUpdated(address indexed operator, bool status);
    
    /**
     * @dev Constructor sets the deployer as both owner and initial operator
     */
    constructor() Ownable(msg.sender) {
        operators[msg.sender] = true;
    }
    
    /**
     * @dev Modifier to restrict functions to authorized operators only
     */
    modifier onlyOperator() {
        require(operators[msg.sender], "BaseFiWallet: Not authorized operator");
        _;
    }
    
    /**
     * @dev Add or remove operator permissions
     * @param operator Address to update
     * @param status True to grant operator rights, false to revoke
     */
    function setOperator(address operator, bool status) external onlyOwner {
        operators[operator] = status;
        emit OperatorUpdated(operator, status);
    }
    
    /**
     * @dev Deposit ERC20 tokens into the contract
     * @param token Address of the ERC20 token
     * @param amount Amount of tokens to deposit
     */
    function deposit(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "BaseFiWallet: Transfer failed");
        emit Deposit(token, msg.sender, amount);
    }
    
    /**
     * @dev Withdraw tokens from the contract (operator only)
     * @param token Address of the ERC20 token
     * @param to Recipient address
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(address token, address to, uint256 amount) external onlyOperator {
        require(IERC20(token).transfer(to, amount), "BaseFiWallet: Transfer failed");
        emit Withdrawal(token, to, amount);
    }
    
    /**
     * @dev Get token balance held by this contract
     * @param token Address of the ERC20 token
     * @return Current balance of the token
     */
    function getBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    /**
     * @dev Execute a meta-transaction with user's signature
     * This enables gasless transactions - users sign with their deterministic wallet
     * (generated from phone + PIN), and operators pay the gas fees
     * 
     * @param userAddress Address of the user who signed the transaction
     * @param functionData Encoded function call data
     * @param r ECDSA signature parameter r
     * @param s ECDSA signature parameter s
     * @param v ECDSA signature parameter v
     * @return returnData Result of the executed transaction
     */
    function executeMetaTransaction(
        address userAddress,
        bytes memory functionData,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) external returns (bytes memory) {
        uint256 nonce = nonces[userAddress];
        
        // Verify the signature matches the user address
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(userAddress, nonce, address(this), functionData))
            )
        );
        
        address signer = ecrecover(digest, v, r, s);
        require(signer == userAddress, "BaseFiWallet: Invalid signature");
        
        // Increment nonce to prevent replay attacks
        nonces[userAddress]++;
        
        // Execute the transaction
        (bool success, bytes memory returnData) = address(this).call(functionData);
        require(success, "BaseFiWallet: Transaction execution failed");
        
        emit MetaTransaction(userAddress, msg.sender, functionData);
        
        return returnData;
    }
    
    /**
     * @dev Emergency function to rescue stuck funds (owner only)
     * @param token Address of the ERC20 token
     * @param to Recipient address
     * @param amount Amount of tokens to rescue
     */
    function rescueFunds(address token, address to, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "BaseFiWallet: Transfer failed");
        emit Withdrawal(token, to, amount);
    }
}
