import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new schema with a different collection name
const WalletUserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  { 
    timestamps: true,
    collection: 'wallet_users', // Use a different collection name
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook to log user creation
WalletUserSchema.pre('save', function(next) {
  if (this.isNew) {
    console.log('Creating new user with wallet address:', this.walletAddress);
  } else {
    console.log('Updating user with wallet address:', this.walletAddress);
  }
  next();
});

// Check if the model already exists to prevent overwriting during hot reloads
const UserModel = mongoose.models.WalletUser || mongoose.model<IUser>('WalletUser', WalletUserSchema);

export default UserModel;
