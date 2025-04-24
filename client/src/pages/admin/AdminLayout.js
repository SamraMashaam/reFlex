import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const HoverButton = ({ onClick, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
      
        backgroundColor: hover ? '#a71d2a' : '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        backgroundColor: '#A888B5',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h3 style={{ color: '#fff' }}>Admin Panel</h3>
        <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/admin/add-teacher')}>Add Teacher</button>
        <button onClick={() => navigate('/admin/add-student')}>Add Student</button>
        <button onClick={() => navigate('/admin/class-management')}>Class Management</button>
        <button onClick={() => navigate('/admin/assign-class')}>Assign/Unassign Classes</button>
        <button onClick={() => navigate('/admin/view-teachers')}>View Teachers</button>
        <button onClick={() => navigate('/admin/view-students')}>View Students</button>
        <button onClick={() => navigate('/admin/view-classes')}>View Classes</button>
        <button onClick={() => navigate('/admin/enroll-students')}>Enroll/Unenroll Students</button>
        <HoverButton onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>Logout</HoverButton>
      </div>

      {/* Main Page Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
