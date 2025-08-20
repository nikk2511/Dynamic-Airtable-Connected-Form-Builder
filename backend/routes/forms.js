const express = require('express');
const { body, validationResult } = require('express-validator');
const Form = require('../models/Form');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Validation middleware
const validateForm = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('airtableBaseId').notEmpty().withMessage('Base ID is required'),
  body('airtableTableId').notEmpty().withMessage('Table ID is required'),
  body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.airtableFieldId').notEmpty().withMessage('Field ID is required'),
  body('fields.*.label').trim().notEmpty().withMessage('Field label is required'),
  body('fields.*.type').isIn(['singleLineText', 'multiLineText', 'singleSelect', 'multipleSelect', 'attachment'])
];

// Get all forms for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { user: req.user._id };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');
    
    const total = await Form.countDocuments(query);
    
    res.json({
      forms,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

// Get a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('user', 'name email');
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json({ form });
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// Create a new form
router.post('/', authMiddleware, validateForm, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const {
      title,
      description,
      airtableBaseId,
      airtableTableId,
      airtableTableName,
      airtableBaseName,
      fields,
      settings
    } = req.body;
    
    // Verify that the user has access to this base/table
    const user = await User.findById(req.user._id);
    try {
      await axios.get(`https://api.airtable.com/v0/meta/bases/${airtableBaseId}/tables`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` }
      });
    } catch (error) {
      return res.status(403).json({ 
        message: 'You do not have access to this Airtable base or table' 
      });
    }
    
    const form = new Form({
      user: req.user._id,
      title,
      description,
      airtableBaseId,
      airtableTableId,
      airtableTableName,
      airtableBaseName,
      fields: fields.map((field, index) => ({
        ...field,
        order: index
      })),
      settings: settings || {}
    });
    
    await form.save();
    await form.populate('user', 'name email');
    
    res.status(201).json({
      form,
      message: 'Form created successfully'
    });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ message: 'Failed to create form' });
  }
});

// Update a form
router.put('/:id', authMiddleware, validateForm, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const form = await Form.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }
    
    const {
      title,
      description,
      fields,
      settings,
      isPublished
    } = req.body;
    
    form.title = title;
    form.description = description;
    form.fields = fields.map((field, index) => ({
      ...field,
      order: index
    }));
    form.settings = { ...form.settings, ...settings };
    
    if (typeof isPublished === 'boolean') {
      form.isPublished = isPublished;
    }
    
    await form.save();
    await form.populate('user', 'name email');
    
    res.json({
      form,
      message: 'Form updated successfully'
    });
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ message: 'Failed to update form' });
  }
});

// Delete a form
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ message: 'Failed to delete form' });
  }
});

// Submit a form (public endpoint)
router.post('/:id/submit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('user');
    
    if (!form || !form.isPublished) {
      return res.status(404).json({ message: 'Form not found or not published' });
    }
    
    const { responses } = req.body;
    
    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ message: 'Form responses are required' });
    }
    
    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => 
      !responses.hasOwnProperty(field.airtableFieldId) || 
      responses[field.airtableFieldId] === '' || 
      responses[field.airtableFieldId] === null
    );
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Required fields are missing',
        missingFields: missingFields.map(f => f.label)
      });
    }
    
    // Process conditional logic - remove hidden fields
    const processedResponses = {};
    
    for (const field of form.fields) {
      const fieldValue = responses[field.airtableFieldId];
      
      // Check if field should be visible based on conditional logic
      if (field.conditional && field.conditional.fieldId) {
        const conditionField = field.conditional.fieldId;
        const conditionValue = field.conditional.value;
        const operator = field.conditional.operator || 'equals';
        const responseValue = responses[conditionField];
        
        let shouldShow = false;
        
        switch (operator) {
          case 'equals':
            shouldShow = responseValue === conditionValue;
            break;
          case 'contains':
            shouldShow = Array.isArray(responseValue) 
              ? responseValue.includes(conditionValue)
              : String(responseValue || '').includes(conditionValue);
            break;
          case 'not_equals':
            shouldShow = responseValue !== conditionValue;
            break;
        }
        
        if (!shouldShow) {
          continue; // Skip this field
        }
      }
      
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        processedResponses[field.airtableFieldId] = fieldValue;
      }
    }
    
    // Submit to Airtable
    try {
      const airtableResponse = await axios.post(
        `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableName}`,
        { fields: processedResponses },
        {
          headers: {
            'Authorization': `Bearer ${form.user.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update submission count
      form.submissionCount += 1;
      await form.save();
      
      res.json({
        success: true,
        message: form.settings.successMessage || 'Thank you for your submission!',
        recordId: airtableResponse.data.id
      });
      
    } catch (airtableError) {
      console.error('Airtable submission error:', airtableError.response?.data || airtableError.message);
      res.status(500).json({
        message: 'Failed to submit form to Airtable',
        error: airtableError.response?.data?.error || 'Submission failed'
      });
    }
    
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ message: 'Failed to submit form' });
  }
});

// Publish/unpublish a form
router.patch('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const form = await Form.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }
    
    form.isPublished = isPublished;
    await form.save();
    
    res.json({
      form,
      message: `Form ${isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    console.error('Publish form error:', error);
    res.status(500).json({ message: 'Failed to update form status' });
  }
});

// Get form analytics/stats
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found or access denied' });
    }
    
    res.json({
      stats: {
        submissionCount: form.submissionCount,
        isPublished: form.isPublished,
        createdAt: form.createdAt,
        lastUpdated: form.updatedAt,
        formUrl: form.formUrl
      }
    });
  } catch (error) {
    console.error('Get form stats error:', error);
    res.status(500).json({ message: 'Failed to fetch form statistics' });
  }
});

module.exports = router;
