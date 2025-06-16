const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, teacherId, department } = req.body;

    console.log('Registration request body:', req.body);

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Validate required fields
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }
    
    // Check if rollNumber is provided for students
    if (role === 'student' && !rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Roll number is required for students' 
      });
    }
    
    // Check if teacherId is provided for teachers
    if (role === 'teacher' && !teacherId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Teacher ID is required for teachers' 
      });
    }

    // For teachers, make sure teacherId is not the same as any student's rollNumber
    if (role === 'teacher') {
      const existingStudentWithRollNumber = await User.findOne({ 
        role: 'student', 
        rollNumber: teacherId 
      });
      
      if (existingStudentWithRollNumber) {
        return res.status(400).json({
          success: false,
          message: `Teacher ID '${teacherId}' is already used as a roll number by a student. Please use a different ID.`,
          field: 'teacherId'
        });
      }
    }

    // For students, make sure rollNumber is not the same as any teacher's teacherId
    if (role === 'student') {
      const existingTeacherWithId = await User.findOne({ 
        role: 'teacher', 
        teacherId: rollNumber 
      });
      
      if (existingTeacherWithId) {
        return res.status(400).json({
          success: false,
          message: `Roll number '${rollNumber}' is already used as a teacher ID. Please use a different roll number.`,
          field: 'rollNumber'
        });
      }
    }

    // Prepare user object based on role
    const userData = {
      name,
      email,
      password,
      role,
      department
    };
    
    // Add role-specific fields and explicitly set the other role's field to undefined
    if (role === 'student') {
      userData.rollNumber = rollNumber;
      userData.teacherId = undefined; // Explicitly set teacherId to undefined for students
    } else if (role === 'teacher') {
      userData.teacherId = teacherId;
      userData.rollNumber = undefined; // Explicitly set rollNumber to undefined for teachers
    }
    
    console.log('Creating user with data:', userData);
    
    // Create user
    const user = await User.create(userData);

    // Send response with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    } else if (error.code === 11000) {
      // Extract the duplicate key field
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      
      // Capture the role from request body since we're in catch block
      const userRole = req.body.role;
      
      // Check if we're trying to register a teacher with a duplicate null rollNumber
      if (field === 'rollNumber' && (value === null || value === undefined) && userRole === 'teacher') {
        // This is likely a schema issue with unique constraints; not a real duplicate
        console.error('Schema validation error: null rollNumber conflict for teacher role');
        return res.status(500).json({
          success: false,
          message: 'Internal server error with role validation. Please contact support.',
        });
      }
      
      // Check if we're trying to register a student with a duplicate null teacherId
      if (field === 'teacherId' && (value === null || value === undefined) && userRole === 'student') {
        // This is likely a schema issue with unique constraints; not a real duplicate
        console.error('Schema validation error: null teacherId conflict for student role');
        return res.status(500).json({
          success: false,
          message: 'Internal server error with role validation. Please contact support.',
        });
      }
      
      let customMessage;
      if (field === 'email') {
        customMessage = `Email '${value}' is already registered. Please use a different email or login.`;
      } else if (field === 'rollNumber') {
        customMessage = `Roll number '${value}' is already in use. Please check and try again.`;
      } else if (field === 'teacherId') {
        customMessage = `Teacher ID '${value}' is already in use. Please check and try again.`;
      } else {
        customMessage = `${field} '${value}' is already in use.`;
      }
      
      return res.status(400).json({ 
        success: false, 
        message: customMessage,
        field: field 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, roll } = req.body;

    // Check for admin login (hardcoded)
    if (roll === 'nitesh' && password === 'nitesh') {
      return res.status(200).json({
        success: true,
        token: 'admin-token',
        role: 'admin',
        name: 'Admin'
      });
    }

    // Validate email & password for regular users
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send response with token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Check if user with specific field value exists
// @route   GET /api/auth/check
// @access  Public
exports.checkExistingUser = async (req, res) => {
  try {
    const { type, value } = req.query;
    
    if (!type || !value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type and value parameters'
      });
    }
    
    let query = {};
    let field;
    
    switch (type) {
      case 'roll':
        field = 'rollNumber';
        query = { rollNumber: value };
        break;
      case 'teacher':
        field = 'teacherId';
        query = { teacherId: value };
        break;
      case 'email':
        field = 'email';
        query = { email: value };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type parameter. Use roll, teacher, or email.'
        });
    }
    
    const userExists = await User.findOne(query);
    
    if (userExists) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: `${field} is already in use.`
      });
    }
    
    return res.status(200).json({
      success: true,
      exists: false,
      message: `${field} is available.`
    });
    
  } catch (error) {
    console.error('Error checking existing user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token with error handling
    const token = user.getSignedJwtToken();
    
    res.status(statusCode).json({
      success: true,
      token,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating authentication token'
    });
  }
};