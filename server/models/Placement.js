const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a placement title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a placement description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true
  },
  salary: {
    type: String,
    trim: true,
    default: 'Not disclosed'
  },
  type: {
    type: String,
    required: [true, 'Please specify placement type'],
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  requirements: {
    type: String,
    required: [true, 'Please specify requirements'],
    maxlength: [2000, 'Requirements cannot be more than 2000 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide an application deadline']
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    // Use String type instead of ObjectId in development to avoid validation issues
    // This is a temporary solution for development only
    type: String, // Changed from mongoose.Schema.Types.ObjectId for development
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Placement', PlacementSchema);