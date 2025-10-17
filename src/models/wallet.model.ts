import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  walletAddress: string;
  encryptedKey?: string; // Added field to store encrypted private key
  currency: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    encryptedKey: {
      type: String,
      required: false, // Optional for backward compatibility
    },
    currency: {
      type: String,
      default: 'USDC.e',
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWallet>('Wallet', walletSchema);