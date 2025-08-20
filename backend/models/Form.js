const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  airtableFieldId: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['singleLineText', 'multiLineText', 'singleSelect', 'multipleSelect', 'attachment']
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    id: String,
    name: String,
    color: String
  }],
  conditional: {
    fieldId: String,
    value: String,
    operator: {
      type: String,
      enum: ['equals', 'contains', 'not_equals'],
      default: 'equals'
    }
  },
  order: {
    type: Number,
    default: 0
  }
});

const formSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  airtableBaseId: {
    type: String,
    required: true
  },
  airtableTableId: {
    type: String,
    required: true
  },
  airtableTableName: {
    type: String,
    required: true
  },
  airtableBaseName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  fields: [formFieldSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  settings: {
    allowMultipleSubmissions: {
      type: Boolean,
      default: true
    },
    requireLogin: {
      type: Boolean,
      default: false
    },
    successMessage: {
      type: String,
      default: 'Thank you for your submission!'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
formSchema.index({ user: 1, createdAt: -1 });
formSchema.index({ airtableBaseId: 1, airtableTableId: 1 });
formSchema.index({ isPublished: 1 });

// Virtual for form URL
formSchema.virtual('formUrl').get(function() {
  return `${process.env.FRONTEND_URL}/form/${this._id}`;
});

// Ensure virtual fields are serialized
formSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Form', formSchema);
