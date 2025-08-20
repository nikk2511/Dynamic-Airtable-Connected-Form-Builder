const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper function to get user's Airtable access token
const getAirtableToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.accessToken) {
    throw new Error('User not found or no access token available');
  }
  return user.accessToken;
};

// Helper function to make Airtable API requests
const makeAirtableRequest = async (url, accessToken, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PATCH')) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Airtable access token expired or invalid');
    }
    throw error;
  }
};

// Get all bases for the authenticated user
router.get('/bases', authMiddleware, async (req, res) => {
  try {
    const accessToken = await getAirtableToken(req.user._id);
    const data = await makeAirtableRequest(
      'https://api.airtable.com/v0/meta/bases',
      accessToken
    );
    
    res.json({
      bases: data.bases.map(base => ({
        id: base.id,
        name: base.name,
        permissionLevel: base.permissionLevel
      }))
    });
  } catch (error) {
    console.error('Get bases error:', error.message);
    res.status(error.message.includes('token') ? 401 : 500).json({
      message: 'Failed to fetch bases',
      error: error.message
    });
  }
});

// Get tables for a specific base
router.get('/bases/:baseId/tables', authMiddleware, async (req, res) => {
  try {
    const { baseId } = req.params;
    const accessToken = await getAirtableToken(req.user._id);
    
    const data = await makeAirtableRequest(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      accessToken
    );
    
    res.json({
      tables: data.tables.map(table => ({
        id: table.id,
        name: table.name,
        primaryFieldId: table.primaryFieldId,
        description: table.description
      }))
    });
  } catch (error) {
    console.error('Get tables error:', error.message);
    res.status(error.message.includes('token') ? 401 : 500).json({
      message: 'Failed to fetch tables',
      error: error.message
    });
  }
});

// Get fields for a specific table
router.get('/bases/:baseId/tables/:tableId/fields', authMiddleware, async (req, res) => {
  try {
    const { baseId, tableId } = req.params;
    const accessToken = await getAirtableToken(req.user._id);
    
    const data = await makeAirtableRequest(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      accessToken
    );
    
    const table = data.tables.find(t => t.id === tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    // Filter only supported field types
    const supportedTypes = ['singleLineText', 'multiLineText', 'singleSelect', 'multipleSelect', 'attachment'];
    const supportedFields = table.fields.filter(field => 
      supportedTypes.includes(field.type)
    );
    
    res.json({
      fields: supportedFields.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        description: field.description,
        options: field.options || null
      })),
      tableName: table.name
    });
  } catch (error) {
    console.error('Get fields error:', error.message);
    res.status(error.message.includes('token') ? 401 : 500).json({
      message: 'Failed to fetch fields',
      error: error.message
    });
  }
});

// Create a record in Airtable (for form submissions)
router.post('/bases/:baseId/tables/:tableId/records', authMiddleware, async (req, res) => {
  try {
    const { baseId, tableId } = req.params;
    const { fields } = req.body;
    
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ message: 'Fields data is required' });
    }
    
    const accessToken = await getAirtableToken(req.user._id);
    
    // Get table name first
    const tablesData = await makeAirtableRequest(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      accessToken
    );
    
    const table = tablesData.tables.find(t => t.id === tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    const recordData = await makeAirtableRequest(
      `https://api.airtable.com/v0/${baseId}/${table.name}`,
      accessToken,
      'POST',
      { fields }
    );
    
    res.json({
      record: recordData,
      message: 'Record created successfully'
    });
    
  } catch (error) {
    console.error('Create record error:', error.response?.data || error.message);
    
    if (error.response?.status === 422) {
      return res.status(422).json({
        message: 'Invalid field data',
        error: error.response.data
      });
    }
    
    res.status(error.message.includes('token') ? 401 : 500).json({
      message: 'Failed to create record',
      error: error.message
    });
  }
});

// Test Airtable connection
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const accessToken = await getAirtableToken(req.user._id);
    
    const data = await makeAirtableRequest(
      'https://api.airtable.com/v0/meta/whoami',
      accessToken
    );
    
    res.json({
      connected: true,
      user: data,
      message: 'Airtable connection successful'
    });
  } catch (error) {
    console.error('Test connection error:', error.message);
    res.status(error.message.includes('token') ? 401 : 500).json({
      connected: false,
      message: 'Airtable connection failed',
      error: error.message
    });
  }
});

module.exports = router;
