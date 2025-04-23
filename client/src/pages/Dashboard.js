import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/teacher/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="page-container">
      <h2>Your Classes</h2>
      <button onClick={() => navigate('/notifications')}>
        Notifications
      </button>

      {classes.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <ul>
          {classes.map((cls) => (
            <li key={cls._id}>
              <strong>{cls.name}</strong> - {cls.subject} ({cls.section})<br />
              Students: {cls.students.length}<br />
              <a href={`/class/${cls._id}/attendance`}>Attendance</a> |{' '}
              <a href={`/class/${cls._id}/grades`}>Grades</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
