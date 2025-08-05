const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  phone: String,
  website: String,
  boothNumber: String,
  boothSize: {
    type: String,
    enum: ['10x10', '10x20', '20x20', 'Custom'],
    default: '10x10'
  },
  logo: {
    filename: String,
    originalName: String,
    path: String,
    approved: {
      type: Boolean,
      default: false
    }
  },
  companyInfo: {
    description: String,
    products: [String],
    targetAudience: String,
    approved: {
      type: Boolean,
      default: false
    }
  },
  onboardingChecklist: {
    logoUploaded: { type: Boolean, default: false },
    companyInfoSubmitted: { type: Boolean, default: false },
    webinarDateSelected: { type: Boolean, default: false },
    marketingBannerGenerated: { type: Boolean, default: false }
  },
  webinarDate: {
    type: Date,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid in Full'],
    default: 'Pending'
  },
  boothUpgrade: {
    requested: { type: Boolean, default: false },
    currentSize: { type: String, default: '10x10' },
    requestedSize: String,
    approved: { type: Boolean, default: false }
  },
  marketingBanner: {
    generated: { type: Boolean, default: false },
    imagePath: String,
    eventName: { type: String, default: 'Small Business Expo 2024' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

exhibitorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exhibitor', exhibitorSchema); 