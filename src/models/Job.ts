import mongoose, { Schema } from 'mongoose';

// Completely redefined Job schema without company, location, and type fields
const JobSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a job category'],
    enum: ['Trench Coaching', 'Sniper Guru', 'Fee Masterclass', 'Logo Maker', 'Telegram Bot Developer', 'Web Developer', 'Other'],
  },
  salary: {
    type: String,
    required: [true, 'Please provide a salary range'],
  },
  contactInfo: {
    type: String,
    required: [true, 'Please provide contact information'],
  },
  logo: {
    type: String,
    required: [true, 'Please provide a company logo'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete the existing model if it exists
if (mongoose.models.Job) {
  delete mongoose.models.Job;
}

// Export the model
export default mongoose.model('Job', JobSchema);
