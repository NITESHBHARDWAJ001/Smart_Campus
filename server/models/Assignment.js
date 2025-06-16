const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assignment title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide an assignment description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
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

module.exports = mongoose.model('Assignment', AssignmentSchema);