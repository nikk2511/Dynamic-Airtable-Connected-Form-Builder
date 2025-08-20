// MongoDB Initialization Script
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('airtable-form-builder');

// Create application user
db.createUser({
  user: 'app',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'airtable-form-builder'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ airtableUserId: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

db.forms.createIndex({ user: 1, createdAt: -1 });
db.forms.createIndex({ airtableBaseId: 1, airtableTableId: 1 });
db.forms.createIndex({ isPublished: 1 });

print('Database initialized successfully!');
