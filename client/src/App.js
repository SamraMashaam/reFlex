import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Notifications from './pages/Notifications';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AddStudent from './pages/admin/AddStudent';
import ClassManagement from './pages/admin/ClassManagement';
import AssignClass from './pages/admin/AssignClass';
import ViewTeachers from './pages/admin/ViewTeachers';
import ViewStudents from './pages/admin/ViewStudents';
import ViewClasses from './pages/admin/ViewClasses';
import EnrollStudents from './pages/admin/EnrollStudents';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/class/:classId/attendance" element={<Attendance />} />
        <Route path="/class/:classId/grades" element={<Grades />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-teacher" element={<Register/>}/>
          <Route path="add-student" element={<AddStudent />} />
          <Route path="class-management" element={<ClassManagement />} />
          <Route path="assign-class" element={<AssignClass />} />
          <Route path="view-teachers" element={<ViewTeachers />} />
          <Route path="view-students" element={<ViewStudents />} />
          <Route path="view-classes" element={<ViewClasses />} />
          <Route path="enroll-students" element={<EnrollStudents />} />
        {/* You'll add more class pages later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App