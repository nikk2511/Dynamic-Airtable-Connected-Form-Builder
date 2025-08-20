// Environment Configuration Example
// Copy this file to config.js and update with your actual values

module.exports = {
  // Database Configuration
  MONGODB_URI: 'mongodb://localhost:27017/airtable-form-builder',

  // JWT Secret for authentication tokens
  JWT_SECRET: 'your-super-secure-jwt-secret-key-here',

  // Airtable OAuth Configuration
  // Get these from your Airtable Developer account: https://airtable.com/developers/web/api/oauth-reference
  AIRTABLE_CLIENT_ID: 'your-airtable-client-id',
  AIRTABLE_CLIENT_SECRET: 'your-airtable-client-secret',
  AIRTABLE_REDIRECT_URI: 'http://localhost:3000/login',

  // Server Configuration
  PORT: 5000,
  NODE_ENV: 'development',

  // Frontend Configuration (for CORS)
  FRONTEND_URL: 'http://localhost:3000',

  // Optional: Deployment URLs for production
  // FRONTEND_URL: 'https://your-frontend-domain.com',
  // AIRTABLE_REDIRECT_URI: 'https://your-frontend-domain.com/login'
};
