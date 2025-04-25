import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transcript from './pages/Transcript';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import LoginPage from './pages/Login';
import { ThemeContext } from './context/ThemeContext';
import './styles.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const DashboardWrapper = () => {
  const { rollNumber } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authorization token found');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/student/${rollNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error fetching student data');
        setLoading(false);
      });
  }, [rollNumber]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <StudentNavbar />
      <div className="main-content">
        {student ? (
          <Dashboard student={student} rollNumber={rollNumber} />
        ) : (
          <div className="error">No student data available</div>
        )}
      </div>
    </>
  );
};

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/:rollNumber"
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/:rollNumber"
            element={
              <ProtectedRoute>
                <StudentNavbar />
                <div className="main-content">
                  <Attendance />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades/:rollNumber"
            element={
              <ProtectedRoute>
                <StudentNavbar />
                <div className="main-content">
                  <Grades />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transcript/:rollNumber"
            element={
              <ProtectedRoute>
                <StudentNavbar />
                <div className="main-content">
                  <Transcript />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <>
                {localStorage.removeItem('token')}
                <Navigate to="/login" replace />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;