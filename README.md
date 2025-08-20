# Airtable Form Builder

A powerful, full-stack MERN application that lets you create beautiful, intelligent forms connected directly to your Airtable bases. Build dynamic forms with conditional logic, collect responses seamlessly, and manage everything from an intuitive dashboard.

## 🌟 Features

- **Seamless Airtable Integration**: Connect directly to your Airtable bases and tables using OAuth
- **Drag-and-Drop Form Builder**: Intuitive interface for creating forms without coding
- **Smart Conditional Logic**: Show/hide fields based on user responses in real-time
- **Multiple Field Types**: Support for text, select, multi-select, and file upload fields
- **Real-time Analytics**: Track form submissions and performance
- **Mobile Responsive**: Forms work perfectly on any device
- **Secure Authentication**: OAuth 2.0 integration with Airtable
- **Professional Dashboard**: Manage all your forms from one central location

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Airtable Developer Account

### 1. Clone the Repository

```bash
git clone https://github.com/bustbrain-labs/airtable-form-builder.git
cd airtable-form-builder
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-deps
```

### 3. Set Up Airtable OAuth

1. Go to [Airtable Developers](https://airtable.com/developers/web/api/oauth-reference)
2. Create a new OAuth integration
3. Set the redirect URI to: `http://localhost:3000/login`
4. Note down your Client ID and Client Secret

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
cp config.example.js .env
```

Update the `.env` file with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Airtable OAuth
AIRTABLE_CLIENT_ID=your-airtable-client-id
AIRTABLE_CLIENT_SECRET=your-airtable-client-secret
AIRTABLE_REDIRECT_URI=http://localhost:3000/login

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service
sudo service mongod start

# Or using MongoDB Compass/Docker
```

### 6. Run the Application

```bash
# Start both backend and frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 How It Works

### Authentication Flow

1. **Login**: Users click "Connect with Airtable" on the login page
2. **OAuth Redirect**: User is redirected to Airtable for authorization
3. **Token Exchange**: App receives authorization code and exchanges it for access token
4. **User Creation**: User profile is created/updated in MongoDB
5. **JWT Token**: App issues JWT token for subsequent API calls

### Form Building Process

1. **Select Base**: Choose from user's Airtable bases
2. **Select Table**: Pick a table from the chosen base
3. **Choose Fields**: Select which fields to include in the form
4. **Configure Logic**: Set up conditional field visibility
5. **Customize**: Add labels, descriptions, and validation rules
6. **Publish**: Make the form live and shareable

### Conditional Logic

The conditional logic system allows you to show/hide fields based on other field values:

```javascript
// Example: Show "GitHub URL" field only if "Role" field equals "Engineer"
{
  fieldId: "github_url_field",
  conditional: {
    fieldId: "role_field",
    value: "Engineer",
    operator: "equals" // Also supports "contains", "not_equals"
  }
}
```

### Form Submission

1. **Validation**: Client-side validation for required fields
2. **Conditional Processing**: Hidden fields are excluded from submission
3. **Airtable Sync**: Data is sent directly to the connected Airtable table
4. **Response**: User sees success message or error details

## 🏗️ Architecture

### Backend Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js       # User authentication data
│   └── Form.js       # Form configuration
├── routes/           # Express routes
│   ├── auth.js       # Authentication endpoints
│   ├── airtable.js   # Airtable API integration
│   └── forms.js      # Form CRUD operations
├── middleware/       # Custom middleware
│   └── auth.js       # JWT verification
└── server.js         # Express app configuration
```

### Frontend Structure

```
frontend/src/
├── components/       # Reusable components
│   ├── Layout/       # Header, Sidebar, Layout
│   └── UI/           # Loading, Buttons, etc.
├── contexts/         # React Context providers
│   └── AuthContext.js
├── pages/            # Route components
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── FormBuilderPage.js
│   └── FormViewerPage.js
└── App.js            # Main app with routing
```

## 🔧 API Reference

### Authentication

```bash
# Get OAuth URL
GET /api/auth/airtable/url

# Handle OAuth callback
POST /api/auth/airtable/callback
Body: { code, state }

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Airtable Integration

```bash
# Get user's bases
GET /api/airtable/bases

# Get tables in a base
GET /api/airtable/bases/:baseId/tables

# Get fields in a table
GET /api/airtable/bases/:baseId/tables/:tableId/fields
```

### Form Management

```bash
# Create form
POST /api/forms
Body: { title, airtableBaseId, airtableTableId, fields, ... }

# Get user's forms
GET /api/forms?page=1&limit=10&search=query

# Update form
PUT /api/forms/:id

# Delete form
DELETE /api/forms/:id

# Submit form (public)
POST /api/forms/:id/submit
Body: { responses: { fieldId: value } }
```

## 🔒 Security Features

- **OAuth 2.0**: Secure Airtable authentication
- **JWT Tokens**: Stateless authentication with expiration
- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Server-side validation using express-validator
- **Helmet.js**: Security headers and protection

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables in dashboard
4. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)

1. Push frontend code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Configure environment variables

### Environment Variables for Production

```env
# Backend
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=production-secret-key
AIRTABLE_CLIENT_ID=prod-client-id
AIRTABLE_CLIENT_SECRET=prod-client-secret
AIRTABLE_REDIRECT_URI=https://your-domain.com/login
FRONTEND_URL=https://your-domain.com
NODE_ENV=production

# Frontend
REACT_APP_API_URL=https://your-backend-api.com/api
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](https://github.com/bustbrain-labs/airtable-form-builder/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/bustbrain-labs/airtable-form-builder/issues)
- **Email**: support@bustbrainlabs.com
- **Discord**: Join our [community server](https://discord.gg/bustbrainlabs)

## 🎯 Roadmap

- [ ] **Templates System**: Pre-built form templates
- [ ] **Advanced Analytics**: Detailed submission analytics
- [ ] **Export Options**: PDF/CSV export of responses
- [ ] **Team Collaboration**: Multi-user form management
- [ ] **Custom Themes**: Advanced styling options
- [ ] **Webhooks**: Real-time submission notifications
- [ ] **API Access**: Programmatic form management

---

Built with ❤️ by [BustBrain Labs](https://bustbrainlabs.com)
#   D y n a m i c - A i r t a b l e - C o n n e c t e d - F o r m - B u i l d e r  
 