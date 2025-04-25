import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import '../styles.css';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toggleTheme } = useContext(ThemeContext);

  const validateInputs = () => {
    if (!rollNumber || !password) {
      setError('Roll number and password are required');
      return false;
    }
    if (!/^[0-9]{2}[A-Z]-[0-9]{4}$/.test(rollNumber)) {
      setError('Invalid roll number format (e.g., 22I-0798)');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) return;
    console.log('Sending login request:', { rollNumber, password });
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        rollNumber,
        password,
      });
      console.log('Login response:', res.data);
      if (!res.data.token || !res.data.rollNumber) {
        throw new Error('Invalid response: token or rollNumber missing');
      }
      localStorage.setItem('token', res.data.token);
      console.log('Token stored:', localStorage.getItem('token'));
      const dashboardPath = `/dashboard/${res.data.rollNumber}`;
      console.log('Navigating to:', dashboardPath);
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err.message, err.response?.data);
      setError(err.response?.data?.message || `Login failed: ${err.message}`);
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card">
        <h1>Student Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              placeholder="e.g., 22I-0798"
              className={error && !rollNumber ? 'input-error' : ''}
              aria-label="Roll Number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={error && !password ? 'input-error' : ''}
              aria-label="Password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button onClick={toggleTheme} className="theme-toggle">
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default LoginPage;