// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseFiToken
 * @dev ERC20 token for BaseFi USSD wallet on Base blockchain
 * @notice This token represents USD value in the BaseFi ecosystem
 */
contract BaseFiToken is ERC20, Ownable {
    uint8 private _decimals = 6;
    
    /**
     * @dev Constructor that mints initial supply to deployer
     * Token Name: BaseFi USD
     * Token Symbol: bUSD
     * Decimals: 6 (like USDC)
     */
    constructor() ERC20("BaseFi USD", "bUSD") Ownable(msg.sender) {
        // Mint 1,000,000 tokens to the deployer for initial distribution
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Function for admin to mint more tokens (used for deposits)
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in smallest unit)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
