# BaseFi Quick Reference Guide

## 🚀 Quick Start Commands

### Development Setup
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Base RPC URL and private keys

# Compile smart contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start development server
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Backend Development
```bash
npm run dev
# Backend runs on http://localhost:3000
```

---

## 📝 Environment Variables

### Required Variables (.env)
```bash
# Base Network
BASE_RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# Smart Contracts (Base Sepolia)
BASEFI_TOKEN_ADDRESS=0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C
BASEFI_WALLET_ADDRESS=0xC900D20E7ec5Ee83179388591b01Af42714d511A

# Wallet Configuration
FAUCET_PRIVATE_KEY=your_private_key_here
OPERATOR_PRIVATE_KEY=your_private_key_here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster/basefi

# Server
PORT=3000
NODE_ENV=development
```

---

## 🔗 Important Addresses

### Base Sepolia Testnet
| Contract | Address |
|----------|---------|
| BaseFiToken (bUSD) | `0x334E2c9e60191Ce4af10db74aC5c3f1B30C99b9C` |
| BaseFiWallet | `0xC900D20E7ec5Ee83179388591b01Af42714d511A` |

### Network Details
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

---

## 📚 Key Files & Directories

### Smart Contracts
- `src/blockchain/contracts/BaseFiToken.sol` - bUSD stablecoin
- `src/blockchain/contracts/BaseFiWallet.sol` - Smart contract wallet
- `src/blockchain/scripts/deploy.ts` - Deploy wallet
- `src/blockchain/scripts/deployToken.ts` - Deploy token

### Backend Services
- `src/blockchain/services/provider.ts` - Base RPC provider
- `src/blockchain/services/tokenService.ts` - Token operations
- `src/blockchain/services/walletService.ts` - Wallet management
- `src/services/faucetService.ts` - Token minting & gas funding
- `src/ussd/ussdService.ts` - USSD menu logic

### Frontend
- `frontend/src/pages/Home.tsx` - Main landing page
- `frontend/src/section/WhyBase.tsx` - Base blockchain benefits
- `frontend/src/constant/index.ts` - App constants
- `frontend/src/index.css` - Base blue theme

---

## 🎨 Brand Assets

### Colors
```css
/* Base Blue */
--primary-color: #0052FF;

/* Light Mode */
--background: #FFFFFF;
--text: #000000;

/* Dark Mode */
--background: #000000;
--text: #FFFFFF;
```

### Typography
- **Display Font**: Helvetica Neue
- **Body Font**: System UI
- **Code Font**: SF Mono

---

## 🔧 Common Tasks

### Deploy Contracts
```bash
# Deploy BaseFiToken
npx hardhat run src/blockchain/scripts/deployToken.ts --network baseSepolia

# Deploy BaseFiWallet
npx hardhat run src/blockchain/scripts/deploy.ts --network baseSepolia
```

### Verify Contracts
```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Test USSD Interface
```bash
npm run mock-ussd
# Dial *123# to start
```

### Build Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist
```

### Build Backend
```bash
npm run build
# Output in dist/
```

---

## 🐛 Troubleshooting

### Contract Compilation Errors
```bash
# Clear cache and rebuild
npx hardhat clean
npx hardhat compile
```

### RPC Connection Issues
- Check `BASE_RPC_URL` in `.env`
- Verify network connectivity
- Try alternative RPC: `https://base-sepolia.blockpi.network/v1/rpc/public`

### MongoDB Connection Failed
- Check `MONGODB_URI` format
- Verify IP whitelist in MongoDB Atlas
- Ensure database name is `basefi`

### Frontend Build Errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📖 Documentation

### Project Docs
- `README.md` - Project overview
- `MIGRATION-PHASE-1-COMPLETE.md` - Configuration migration
- `MIGRATION-PHASE-2-COMPLETE.md` - Smart contracts
- `MIGRATION-PHASE-3-COMPLETE.md` - Backend services
- `MIGRATION-PHASE-4-COMPLETE.md` - Frontend updates
- `PROJECT-MIGRATION-SUMMARY.md` - Complete summary

### External Resources
- [Base Docs](https://docs.base.org)
- [Hardhat Docs](https://hardhat.org/docs)
- [ethers.js v5](https://docs.ethers.org/v5/)
- [React Docs](https://react.dev)

---

## 🔑 Key Concepts

### USSD Flow
1. User dials USSD code (e.g., *123#)
2. Menu displays options
3. User selects action (deposit/transfer/withdraw)
4. PIN authentication
5. Transaction executed via meta-transaction (gasless)
6. Confirmation message

### Meta-Transactions
- User signs transaction off-chain
- Operator submits transaction on-chain
- User pays no gas fees
- Enabled by `BaseFiWallet.executeMetaTransaction()`

### Token System
- **bUSD**: ERC20 stablecoin, 6 decimals
- **Minting**: Owner can mint for deposits
- **Burning**: Users can burn tokens
- **Transfer**: Standard ERC20 transfers

---

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```

### Run Specific Test
```bash
npx hardhat test test/BaseFiToken.test.ts
```

### Coverage Report
```bash
npx hardhat coverage
```

---

## 📦 Deployment Checklist

### Pre-Production
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] Contracts verified on BaseScan
- [ ] Backup private keys securely
- [ ] Monitor setup (logs, alerts)

### Production Deploy
- [ ] Deploy to Base Mainnet
- [ ] Update RPC URLs
- [ ] Update contract addresses
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Configure DNS
- [ ] SSL certificates
- [ ] Test end-to-end flow

---

## 🎯 API Endpoints

### Backend API
```
POST /api/ussd - USSD gateway callback
GET /api/health - Health check
GET / - Welcome message
```

### Frontend Routes
```
/ - Home page
/ussd - USSD simulator
```

---

## 💰 Token Operations

### Mint Tokens (Backend)
```typescript
import { mintBaseFiUSD } from './services/faucetService'

await mintBaseFiUSD(walletAddress, amount)
```

### Check Balance
```typescript
import { getTokenBalance } from './blockchain/services/tokenService'

const balance = await getTokenBalance(address, 'bUSD')
```

### Transfer Tokens
```typescript
import { executeMetaTransaction } from './blockchain/services/walletService'

await executeMetaTransaction(
  walletAddress,
  recipientAddress,
  amount,
  signature
)
```

---

## 🌐 Network Switching

### Current: Base Sepolia (Testnet)
```javascript
BASE_RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
```

### Future: Base Mainnet
```javascript
BASE_RPC_URL=https://mainnet.base.org
CHAIN_ID=8453
```

---

## 📞 Support

### Issues
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Documentation: Check docs first

### Social
- Twitter: @basefi
- Telegram: @basefi

---

## 📄 License

[Your License Here]

---

**BaseFi** - Financial inclusion through blockchain technology  
Built on Base | Powered by Community

---

*Last Updated: 2025*  
*Version: 1.0*
