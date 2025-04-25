import React from 'react';
import { useParams } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCheckCircle, FaFileAlt, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';
import '../styles.css';

const StudentNavbar = () => {
  const { rollNumber } = useParams();
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <Link className="Logo" to={`/dashboard/${rollNumber}`}>
          reFlex
        </Link>
      </div>
      <div className="sidebar-content">
        <Nav className="nav-links">
          <Nav.Link as={Link} to={`/dashboard/${rollNumber}`} className="nav-link">
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to={`/attendance/${rollNumber}`} className="nav-link">
            <FaCheckCircle className="nav-icon" /> Attendance
          </Nav.Link>
          <Nav.Link as={Link} to={`/grades/${rollNumber}`} className="nav-link">
            <FaFileAlt className="nav-icon" /> Grades
          </Nav.Link>
          <Nav.Link as={Link} to={`/transcript/${rollNumber}`} className="nav-link">
            <FaGraduationCap className="nav-icon" /> Transcript
          </Nav.Link>
          <Nav.Link as={Link} to="/logout" className="nav-link">
            <FaSignOutAlt className="nav-icon" /> Logout
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default StudentNavbar;