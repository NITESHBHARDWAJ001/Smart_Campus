/**
 * CORS Middleware
 * 
 * Handles Cross-Origin Resource Sharing to enable browser access from different domains
 */

const corsMiddleware = (req, res, next) => {
  // Allow requests from any origin in development
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // Allow specific HTTP methods
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  
  next();
};

module.exports = corsMiddleware;