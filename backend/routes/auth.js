const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Airtable OAuth configuration
const AIRTABLE_CLIENT_ID = process.env.AIRTABLE_CLIENT_ID;
const AIRTABLE_CLIENT_SECRET = process.env.AIRTABLE_CLIENT_SECRET;
const AIRTABLE_REDIRECT_URI = process.env.AIRTABLE_REDIRECT_URI;

// Generate OAuth URL for Airtable
router.get('/airtable/url', (req, res) => {
  const state = jwt.sign(
    { timestamp: Date.now() }, 
    process.env.JWT_SECRET, 
    { expiresIn: '10m' }
  );
  
  const authUrl = new URL('https://airtable.com/oauth2/v1/authorize');
  authUrl.searchParams.append('client_id', AIRTABLE_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', AIRTABLE_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'data.records:read data.records:write schema.bases:read');
  authUrl.searchParams.append('state', state);
  
  res.json({ authUrl: authUrl.toString() });
});

// Handle OAuth callback from Airtable
router.post('/airtable/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code || !state) {
      return res.status(400).json({ message: 'Missing authorization code or state' });
    }

    // Verify state parameter
    try {
      jwt.verify(state, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid state parameter' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://airtable.com/oauth2/v1/token', {
      client_id: AIRTABLE_CLIENT_ID,
      client_secret: AIRTABLE_CLIENT_SECRET,
      redirect_uri: AIRTABLE_REDIRECT_URI,
      code: code,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user info from Airtable
    const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const airtableUser = userResponse.data;

    // Find or create user in our database
    let user = await User.findOne({ airtableUserId: airtableUser.id });
    
    if (user) {
      // Update existing user
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      user.email = airtableUser.email;
      user.name = airtableUser.name;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        airtableUserId: airtableUser.id,
        email: airtableUser.email,
        name: airtableUser.name,
        accessToken: access_token,
        refreshToken: refresh_token
      });
      await user.save();
    }

    // Generate JWT token for our app
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: user.toJSON(),
      message: 'Login successful'
    });

  } catch (error) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user information' });
  }
});

// Refresh access token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.refreshToken) {
      return res.status(401).json({ message: 'No refresh token available' });
    }

    const response = await axios.post('https://airtable.com/oauth2/v1/token', {
      client_id: AIRTABLE_CLIENT_ID,
      client_secret: AIRTABLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken
    });

    const { access_token, refresh_token } = response.data;
    
    user.accessToken = access_token;
    if (refresh_token) {
      user.refreshToken = refresh_token;
    }
    await user.save();

    res.json({ message: 'Token refreshed successfully' });

  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  // Since we're using stateless JWT, we just return success
  // In a production app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
