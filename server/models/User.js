const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwtConfig');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  rollNumber: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.role === 'student'; },
    default: undefined,
    validate: {
      validator: function(v) {
        if (this.role === 'student') {
          return !!v;
        } else {
          return v === undefined || v === null;
        }
      },
      message: props => `Invalid rollNumber for role ${this.role}`
    }
  },
  teacherId: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.role === 'teacher'; },
    default: undefined,
    validate: {
      validator: function(v) {
        if (this.role === 'teacher') {
          return !!v;
        } else {
          return v === undefined || v === null;
        }
      },
      message: props => `Invalid teacherId for role ${this.role}`
    }
  },
  department: {
    type: String,
    required: true
  },
  // Additional Profile Fields
  phone: {
    type: String,
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid phone number'],
    default: ''
  },
  resumeLink: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  leetcode: {
    type: String,
    default: ''
  },
  hackerrank: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  try {
    // Use the utility to generate token with proper payload
    return generateToken({ 
      id: this._id, 
      role: this.role 
    });
  } catch (error) {
    console.error('Error in getSignedJwtToken:', error);
    // Return a fallback token with a short expiration for emergency use
    return jwt.sign(
      { id: this._id, role: this.role },
      'emergency_fallback_key',
      { expiresIn: '1h' }
    );
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);