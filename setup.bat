@echo off
echo 🚀 Setting up Airtable Form Builder...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create environment files
echo ⚙️ Setting up environment configuration...
if not exist "backend\.env" (
    copy "backend\config.example.js" "backend\.env.example" >nul
    echo 📝 Created backend\.env.example
    echo    Please copy this to backend\.env and update with your values:
    echo    - MongoDB connection string
    echo    - JWT secret key
    echo    - Airtable OAuth credentials
    echo.
)

if not exist "frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:5000/api > "frontend\.env"
    echo 📝 Created frontend\.env
)

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Set up your Airtable OAuth app:
echo    - Go to https://airtable.com/developers/web/api/oauth-reference
echo    - Create a new OAuth integration
echo    - Set redirect URI to: http://localhost:3000/login
echo.
echo 2. Configure your environment:
echo    - Copy backend\.env.example to backend\.env
echo    - Update with your MongoDB URI and Airtable credentials
echo.
echo 3. Start the development servers:
echo    npm run dev
echo.
echo 🌟 Happy coding!
pause
