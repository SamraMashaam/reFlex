import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/class/:classId/attendance" element={<Attendance />} />
        <Route path="/class/:classId/grades" element={<Grades />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* You'll add more class pages later */}
      </Routes>
    </Router>
  );
}

export default App