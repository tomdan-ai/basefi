import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  RECEIVE = 'RECEIVE',
  GAS_FUNDING = 'GAS_FUNDING',
  PAYOUT = 'PAYOUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  txHash?: string;
  walletAddress?: string;
  reference?: string;
  blockchainTxHash?: string;
  blockNumber?: number;
  failureReason?: string;
  accountNumber?: string;
  bankCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    txHash: {
      type: String,
      required: false,
    },
    walletAddress: {
      type: String,
      required: false,
    },
    reference: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    blockchainTxHash: {
      type: String,
      required: false,
    },
    blockNumber: {
      type: Number,
      required: false,
    },
    failureReason: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    bankCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);