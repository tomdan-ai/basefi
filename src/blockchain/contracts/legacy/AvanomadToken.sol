// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AvanomadToken is ERC20, Ownable {
    uint8 private _decimals = 6;
    
    constructor() ERC20("Avanomad USD", "aUSD") Ownable(msg.sender) {
        // Mint 1,000,000 tokens to the deployer for initial distribution
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Function for admin to mint more tokens (for deposits)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}