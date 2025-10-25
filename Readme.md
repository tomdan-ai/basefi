# BaseFi - Blockchain for Everyone, Everywhere 🚀

## About the Project

BaseFi is a revolutionary blockchain wallet application that brings cryptocurrency access to **basic feature phones** through USSD (Unstructured Supplementary Service Data) codes. Built on Base blockchain, BaseFi enables financial inclusion for the 2+ billion people without smartphones by making crypto transactions as simple as checking airtime balance.

**🎯 Unique Value Proposition**: The only blockchain wallet that works on Nokia 3310-style phones via `*123#` codes - no internet, apps, or smartphones required.

### Key Features
- 📱 **USSD Interface**: Complete wallet functionality via simple phone codes
- ⚡ **Gasless Transactions**: Users never pay gas fees (meta-transactions)
- 🔐 **PIN Security**: Familiar 4-digit authentication like ATM cards
- 💰 **bUSD Stablecoin**: Custom USD-pegged token for the ecosystem
- 🌍 **Base Network**: Built on Coinbase's secure, low-cost L2

## Project Structure

```
BaseFi/
├── src/                          # Backend services (Node.js + TypeScript)
│   ├── blockchain/               # Smart contract interactions
│   │   ├── contracts/           # Solidity contracts
│   │   └── services/            # Blockchain service layer
│   ├── config/                  # App configuration & logging
│   ├── controllers/             # API request handlers
│   ├── models/                  # MongoDB data models
│   ├── routes/                  # API route definitions
│   ├── services/                # Business logic
│   └── ussd/                    # USSD service implementation
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   ├── sections/            # Landing page sections
│   │   └── constants/           # App constants & config
├── cache/                       # Hardhat compilation cache
├── dist/                        # Build outputs
└── docs/                        # Migration & project documentation
```

## How BaseFi Works

### 🔄 Complete User Journey

1. **Account Creation**
   ```
   User dials: *123*0# → Create Account
   Enter: Phone number + 4-digit PIN
   System: Generates deterministic wallet on Base
   ```

2. **Deposit Money**
   ```
   User: Visits agent with cash
   Agent: Mints bUSD tokens to user's wallet
   User: Receives SMS confirmation
   ```

3. **Send Money**
   ```
   User dials: *123*RECIPIENT_PHONE*AMOUNT#
   System: Executes gasless transfer on Base
   Recipient: Gets SMS notification
   ```

4. **Check Balance**
   ```
   User dials: *123*1#
   System: Shows bUSD balance instantly
   ```

5. **Withdraw Cash**
   ```
   User dials: *123*3*AMOUNT#
   Agent: Receives withdrawal request
   User: Collects cash from agent
   ```

### 🔧 Technical Architecture

- **Frontend**: React app for agents and admin dashboard
- **Backend**: Node.js API handling USSD requests and blockchain interactions
- **Blockchain**: Base Sepolia with two main contracts:
  - `BaseFiWallet.sol`: Meta-transaction enabled wallet
  - `BaseFiToken.sol`: bUSD stablecoin (6 decimals)
- **Database**: MongoDB for user data and transaction records
- **Security**: Deterministic wallets (phone + PIN) with no private key storage

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/tomdan-ai/basefi.git
cd basefi

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see below)

# 5. Start MongoDB (if running locally)
mongod

# 6. Run the application
npm run dev          # Backend (http://localhost:3000)
cd frontend && npm run dev  # Frontend (http://localhost:5173)

# 7. Test USSD interface
npm run mock-ussd    # Interactive USSD simulator
```

### Environment Configuration

Update `.env` with these values:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/basefi

# Base Sepolia Network
BASE_RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
PRIVATE_KEY=your_private_key_here

# Deployed Contracts (Base Sepolia)
CONTRACT_ADDRESS=0xC900D20E7ec5Ee83179388591b01Af42714d511A
TOKEN_ADDRESS=0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C

# Security
WALLET_GENERATION_SALT=basefi-base-hackathon-deterministic-wallet-salt

# BaseScan (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key
```

## Smart Contracts on Base Sepolia

### BaseFiToken (bUSD)
- **Contract**: `0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C`
- **Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C)
- **Type**: ERC20 Stablecoin
- **Decimals**: 6 (USDC compatible)
- **Supply**: 1,000,000 bUSD initial
- **Features**: Mintable (owner only), Standard ERC20

### BaseFiWallet
- **Contract**: `0xC900D20E7ec5Ee83179388591b01Af42714d511A`
- **Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0xC900D20E7ec5Ee83179388591b01Af42714d511A)
- **Type**: Smart Contract Wallet
- **Features**: Meta-transactions, Operator system, Multi-token support
- **Security**: ECDSA signature verification, Nonce-based replay protection

### Proof of Deployment
- ✅ **Deployed**: Base Sepolia Testnet (Chain ID: 84532)
- ✅ **Verified**: Contracts verified on BaseScan
- ✅ **Transactions**: 50+ test transactions completed
- ✅ **Functionality**: Full USSD flow tested and working

## Development Commands

```bash
# Smart Contract Development
npx hardhat compile              # Compile contracts
npx hardhat test                 # Run contract tests
npm run deploy-wallet           # Deploy BaseFiWallet
npm run deploy-token            # Deploy BaseFiToken

# Application Development
npm run dev                     # Start backend with hot reload
npm run build                   # Build for production
npm run start                   # Start production server

# Testing
npm run mock-ussd              # Test USSD interface
npm test                       # Run all tests
```

## Contributor

**Built by**: [@tomdan-ai](https://github.com/tomdan-ai)

## Target Customers

1. **Migrant Workers**: Send remittances home instantly with sub-penny fees
2. **Unbanked Populations**: Access digital finance without bank accounts
3. **Small Businesses**: Accept crypto payments via simple USSD codes
4. **Rural Communities**: Financial services where internet is limited
5. **Emergency Situations**: 24/7 money transfers when banks are closed

## Technical Achievements

- ✅ **100% Onchain**: All transactions on Base blockchain
- ✅ **Gasless UX**: Meta-transactions eliminate gas fees for users
- ✅ **Feature Phone Compatible**: Works on any phone with USSD support
- ✅ **Secure**: No private key storage, deterministic wallet generation
- ✅ **Scalable**: Built on Base L2 for low costs and high throughput
- ✅ **Production Ready**: Complete migration from Avalanche to Base

## Future Roadmap

### Phase 1 (Current) ✅
- Smart contracts deployed on Base Sepolia
- USSD simulation system working
- Frontend dashboard complete

### Phase 2 (Next)
- Telecom partnership for real USSD integration
- Deploy to Base Mainnet
- Security audit and testing

### Phase 3 (Future)
- Multi-country expansion
- Additional token support (USDT, DAI)
- Mobile app for smartphone users

## License

MIT License - Built for the Base ecosystem and global financial inclusion.

---

**🚀 BaseFi - Bringing blockchain to everyone, everywhere, on any phone.**