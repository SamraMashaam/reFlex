import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h2>Welcome to the Admin Dashboard</h2>
        <p>Select an option from the left sidebar to manage teachers, students, and classes.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
