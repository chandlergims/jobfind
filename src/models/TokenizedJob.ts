import mongoose from 'mongoose';

const TokenizedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  splTokenAddress: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation for SPL token address format
TokenizedJobSchema.path('splTokenAddress').validate(function(value: string) {
  // Basic validation for Solana addresses (base58 encoded, 32-44 characters)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}, 'Invalid SPL token address format');

export default mongoose.models.TokenizedJob || mongoose.model('TokenizedJob', TokenizedJobSchema);
