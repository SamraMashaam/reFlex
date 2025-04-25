import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const AttendancePage = () => {
  const { rollNumber } = useParams();
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [error, setError] = useState('');

  // Fetch student data and class list
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authorization token found');
      return;
    }

    axios.get(`http://localhost:5000/api/student/${rollNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const studentClasses = res.data.classes || [];
        setClasses(studentClasses);
        if (studentClasses.length > 0) {
          setSelectedClassId(studentClasses[0]._id); // Set the first class as default
        }
      })
      .catch(err => {
        console.error('Error fetching student data:', err.response?.data, err.response?.status);
        setError(err.response?.data?.message || 'Error fetching student data');
      });
  }, [rollNumber]);

  // Fetch attendance data for all classes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || classes.length === 0) return;

    classes.forEach(cls => {
      if (!cls._id) {
        console.warn('Skipping class with missing _id:', cls);
        return;
      }
      console.log('Fetching attendance for:', { classId: cls._id, rollNumber });
      axios.get(`http://localhost:5000/api/attendance/${cls._id}/${rollNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setAttendanceData(prev => ({ ...prev, [cls._id]: res.data }));
        })
        .catch(err => {
          console.error('Error fetching attendance for class:', cls._id, err.response?.data);
          setError(err.response?.data?.message || `Error fetching attendance for ${cls.name}`);
        });
    });
  }, [classes, rollNumber]);

  // Calculate attendance percentage
  const calculatePercentage = (records) => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    return total ? Math.round((present / total) * 100) : 0;
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-content">
      <div className="attendance-page fade-in">
        <h1>Attendance</h1>
        <div className="info-card">
          <div className="tabs">
            {classes.length > 0 ? (
              classes.map(cls => (
                <button
                  key={cls._id}
                  onClick={() => setSelectedClassId(cls._id)}
                  className={`tab-button ${selectedClassId === cls._id ? 'active' : ''}`}
                >
                  {cls.name || 'Unnamed Class'}
                </button>
              ))
            ) : (
              <p>No classes available</p>
            )}
          </div>
          {selectedClassId && attendanceData[selectedClassId] ? (
            <div className="attendance-details fade-in">
              <h4>{classes.find(cls => cls._id === selectedClassId)?.name || 'Unknown Class'}</h4>
              <div className="progress-bar-container">
                <p>Attendance Percentage</p>
                <div className="progress-bar">
                  <div
                    className={`progress ${calculatePercentage(attendanceData[selectedClassId]) < 90 ? 'red' : 'green'}`}
                    style={{ width: `${calculatePercentage(attendanceData[selectedClassId])}%` }}
                  ></div>
                </div>
                <p>{calculatePercentage(attendanceData[selectedClassId])}%</p>
              </div>
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData[selectedClassId].map((record, i) => (
                      <tr key={i}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No attendance data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;