const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Placement',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  resumeLink: {
    type: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate applications
ApplicationSchema.index({ studentId: 1, placementId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);