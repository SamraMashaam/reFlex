import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const MASTER_PASSCODE = 'admin123'; // 🔐 change to env var later

    if (passcode === MASTER_PASSCODE) {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Incorrect passcode');
    }
  };

  return (
    <div className="page-container">
      <h2>Admin Access</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Admin Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <button type="submit">Enter Admin Panel</button>
      </form>
    </div>
  );
};

export default AdminLogin;
