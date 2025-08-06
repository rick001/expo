import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ExhibitorDashboard from './components/ExhibitorDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated && !isAdmin ? <ExhibitorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

export default App; 