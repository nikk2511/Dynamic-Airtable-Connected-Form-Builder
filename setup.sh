#!/bin/bash

# Airtable Form Builder Setup Script
# This script helps you set up the development environment

echo "🚀 Setting up Airtable Form Builder..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. You can:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Use Docker with our docker-compose.yml"
    echo ""
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment file
echo "⚙️  Setting up environment configuration..."
if [ ! -f backend/.env ]; then
    cp backend/config.example.js backend/.env.example
    echo "📝 Created backend/.env.example"
    echo "   Please copy this to backend/.env and update with your values:"
    echo "   - MongoDB connection string"
    echo "   - JWT secret key"
    echo "   - Airtable OAuth credentials"
    echo ""
fi

# Create frontend environment file
if [ ! -f frontend/.env ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
    echo "📝 Created frontend/.env"
fi

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up your Airtable OAuth app:"
echo "   - Go to https://airtable.com/developers/web/api/oauth-reference"
echo "   - Create a new OAuth integration"
echo "   - Set redirect URI to: http://localhost:3000/login"
echo ""
echo "2. Configure your environment:"
echo "   - Copy backend/.env.example to backend/.env"
echo "   - Update with your MongoDB URI and Airtable credentials"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🌟 Happy coding!"
