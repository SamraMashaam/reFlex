import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const GradesPage = () => {
  const { rollNumber } = useParams();
  const [classes, setClasses] = useState([]);
  const [gradesData, setGradesData] = useState({});
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Fetching student data
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:5000/api/student/${rollNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setClasses(res.data.classes);
        if (res.data.classes.length > 0) {
          setSelectedClassId(res.data.classes[0]._id); // Set the first class as default
        }
      })
      .catch(err => console.log('Error fetching student data:', err));
  }, [rollNumber]);

  // Fetching grades data for all classes
  useEffect(() => {
    if (classes.length > 0) {
      classes.forEach(cls => {
        axios.get(`http://localhost:5000/api/grades/${selectedClassId}/${rollNumber}`)
          .then(res => {
            setGradesData(prev => ({ ...prev, [selectedClassId]: res.data }));
          })
          .catch(err => console.log('Error fetching grades data for class:', cls._id, err));
      });
    }
  }, [classes, rollNumber]);

  return (
    <div className="main-content">
      <div className="grades-page fade-in">
        <h1>Grades</h1>
        <div className="info-card">
          <div className="tabs">
            {classes.map(cls => (
              <button
                key={cls._id}
                onClick={() => setSelectedClassId(cls._id)}
                className={`tab-button ${selectedClassId === cls._id ? 'active' : ''}`}
              >
                {cls.name}
              </button>
            ))}
          </div>
          {selectedClassId && gradesData[selectedClassId] ? (
            <div className="grades-details fade-in">
              <h4>{classes.find(cls => cls._id === selectedClassId)?.name}</h4>
              <div className="table-container">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Assignment Type</th>
                      <th>Weightage</th>
                      <th>Total Marks</th>
                      <th>Obtained Marks</th>
                      <th>Min Score</th>
                      <th>Max Score</th>
                      <th>Std Dev</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesData[selectedClassId].map((grade, i) => (
                      <tr key={i}>
                        <td>{grade.assignmentType}</td>
                        <td>{grade.weightage}</td>
                        <td>{grade.totalMarks}</td>
                        <td>{grade.obtainedMarks}</td>
                        <td>{grade.minScore}</td>
                        <td>{grade.maxScore}</td>
                        <td>{grade.stdDev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No grades data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradesPage;