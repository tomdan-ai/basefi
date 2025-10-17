import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  pin?: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pin: {
      type: String,
      required: false,
    },
    walletAddress: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);