/**
 * Server configuration
 */
 
// Set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log(`Environment: ${process.env.NODE_ENV}`);

module.exports = {
  isDevelopment: process.env.NODE_ENV === 'development',
  // Other configuration settings...
};