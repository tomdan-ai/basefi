## Overview

Avanomad is a blockchain-based wallet application designed to provide cryptocurrency access via USSD (Unstructured Supplementary Service Data) interfaces on feature phones. The platform enables financial inclusion by allowing users without smartphones to access and use digital assets on the Avalanche blockchain.

## Features Implemented

### USSD Interface
- **Menu-based Navigation**: Complete USSD menu system for account creation, checking balances, deposits, and withdrawals
- **PIN-based Security**: Transaction authentication using 4-digit PINs
- **Mock USSD CLI**: Testing environment for USSD interactions without actual telecom integration

### Blockchain Integration
- **Avalanche C-Chain**: Built on Avalanche's EVM-compatible blockchain
- **Stablecoin Support**: Integration with USDC.e and USDT.e tokens
- **Smart Contract**: Implementation of AvanomadWallet.sol for secure asset management

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
- **Blockchain**: Ethers.js for Avalanche C-Chain interaction
- **Logging**: Winston logger for comprehensive activity tracking
- **API**: RESTful endpoints for USSD integration and other services

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Avalanche RPC access

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

## Future Enhancements
- Integration with actual USSD service providers
- Multiple blockchain network support
- Enhanced security features
- Additional token support
- Web interface for administration

## License
[License information]