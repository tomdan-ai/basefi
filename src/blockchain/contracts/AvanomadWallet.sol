// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AvanomadWallet is Ownable {
    using ECDSA for bytes32;
    
    mapping(address => bool) public operators;
    mapping(address => uint256) public nonces;
    
    // Events
    event Deposit(address indexed token, address indexed from, uint256 amount);
    event Withdrawal(address indexed token, address indexed to, uint256 amount);
    event MetaTransaction(address indexed user, address indexed executor, bytes action);
    
    constructor() Ownable(msg.sender) {
        operators[msg.sender] = true;
    }
    
    modifier onlyOperator() {
        require(operators[msg.sender], "Not authorized");
        _;
    }
    
    // Add or remove operators
    function setOperator(address operator, bool status) external onlyOwner {
        operators[operator] = status;
    }
    
    // Deposit tokens
    function deposit(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposit(token, msg.sender, amount);
    }
    
    // Withdraw tokens
    function withdraw(address token, address to, uint256 amount) external onlyOperator {
        require(IERC20(token).transfer(to, amount), "Transfer failed");
        emit Withdrawal(token, to, amount);
    }
    
    // Get token balance
    function getBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    // Execute a transaction with a signature (meta-transaction)
    // This allows a user to sign a transaction with their private key generated from
    // their phone number and PIN, without needing gas
    function executeMetaTransaction(
        address userAddress,
        bytes memory functionData,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) external returns (bytes memory) {
        uint256 nonce = nonces[userAddress];
        
        // Verify the signature
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(userAddress, nonce, address(this), functionData))
            )
        );
        
        address signer = ecrecover(digest, v, r, s);
        require(signer == userAddress, "Invalid signature");
        
        // Increment nonce
        nonces[userAddress]++;
        
        // Execute the transaction
        (bool success, bytes memory returnData) = address(this).call(functionData);
        require(success, "Transaction execution failed");
        
        emit MetaTransaction(userAddress, msg.sender, functionData);
        
        return returnData;
    }
    
    // Rescue function for any stuck funds
    function rescueFunds(address token, address to, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "Transfer failed");
        emit Withdrawal(token, to, amount);
    }
}