const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Log important environment variables (without exposing secrets)
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
console.log('- JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NOT SET');
console.log('- PORT:', process.env.PORT);

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
const corsMiddleware = require('./middleware/cors');
app.use(corsMiddleware);

// Favicon route to avoid 404 error
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// Public status route - no auth required
app.use('/api/status', require('./routes/statusRoutes'));
app.use('/api/notice', require('./routes/noticeRoutes'));

// Development routes - only available in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Development routes enabled');
  app.use('/api/dev', require('./routes/development'));
}

// Base route
app.get('/', (req, res) => {
  res.send('Smart Campus API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});