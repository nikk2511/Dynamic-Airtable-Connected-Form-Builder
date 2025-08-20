import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Layout Components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormViewerPage from './pages/FormViewerPage';
import FormEditPage from './pages/FormEditPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route wrapper (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      {/* Form Viewer - Public but standalone */}
      <Route path="/form/:id" element={<FormViewerPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/forms/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <FormBuilderPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/forms/:id/edit" 
        element={
          <ProtectedRoute>
            <Layout>
              <FormEditPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
