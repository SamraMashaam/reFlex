import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  return isAdmin ? children : <Navigate to="/admin" />;
};

export default AdminRoute;
