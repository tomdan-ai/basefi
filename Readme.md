## Overview

BaseFi is a blockchain-based wallet application designed to provide cryptocurrency access via USSD (Unstructured Supplementary Service Data) interfaces on feature phones. The platform enables financial inclusion by allowing users without smartphones to access and use digital assets on the Base blockchain.

## Features Implemented

### USSD Interface
- **Menu-based Navigation**: Complete USSD menu system for account creation, checking balances, deposits, and withdrawals
- **PIN-based Security**: Transaction authentication using 4-digit PINs
- **Mock USSD CLI**: Testing environment for USSD interactions without actual telecom integration

### Blockchain Integration
- **Base Network**: Built on Base, Coinbase's secure, low-cost Ethereum L2 blockchain
- **Stablecoin Support**: Integration with bUSD (BaseFi USD) and native USDC tokens
- **Smart Contract**: Implementation of BaseFiWallet.sol for secure asset management

### Wallet Management
- **Deterministic Wallet Generation**: Wallets are derived from phone number and PIN combinations
- **No Private Key Storage**: Private keys are never stored, only regenerated when needed
- **Meta-transactions**: Gasless transactions allowing users to transact without needing crypto for gas fees

### Security Features
- **Hashed User Data**: Phone numbers and PINs are stored as hashes for enhanced privacy
- **PIN Authentication**: All sensitive operations require PIN verification
- **Signature Verification**: Meta-transactions use cryptographic signatures for security

### Payment Services
- **Mock Payment Integration**: Simulated integration with local payment providers
- **Deposit/Withdrawal Flow**: Complete workflow for moving between fiat and crypto

### Database Models
- **User Model**: Stores user identifiers and authentication data
- **Wallet Model**: Manages wallet addresses and balances
- **Transaction Model**: Records all deposit, withdrawal, and transfer activities

## Technical Stack
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Ethers.js for Base Network interaction
- **Logging**: Winston logger for comprehensive activity tracking
- **API**: RESTful endpoints for USSD integration and other services

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Base RPC access

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build the application
npm run build

# Start the server
npm start

# For development with hot reload
npm run dev

# To test the USSD interface
npm run mock-ussd
```

## Architecture

The application follows a modular architecture:
- blockchain: Contracts and services for blockchain interaction
- config: Application configuration and logging
- controllers: API request handlers
- middlewares: Express middleware functions
- models: MongoDB data models
- routes: API route definitions
- services: Business logic implementation
- ussd: USSD service implementation

## Smart Contracts

### BaseFiToken (bUSD)
- **Address**: 0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C (Base Sepolia)
- **Type**: ERC20 stablecoin
- **Decimals**: 6
- **Features**: Mintable, Burnable, Ownable

### BaseFiWallet
- **Address**: 0xC900D20E7ec5Ee83179388591b01Af42714d511A (Base Sepolia)
- **Type**: Smart contract wallet
- **Features**: Meta-transactions, Operator system, Multi-token support

## Future Enhancements
- Integration with actual USSD service providers
- Multiple blockchain network support (Base Mainnet)
- Enhanced security features
- Additional token support
- Web interface for administration

## License
[License information]