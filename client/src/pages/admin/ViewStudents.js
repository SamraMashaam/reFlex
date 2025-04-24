import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, classRes] = await Promise.all([
          axios.get('/api/student'),
          axios.get('/api/class')
        ]);
        setStudents(studentRes.data);
        setClasses(classRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getEnrolledClasses = (classIds) => {
    return classes.filter(cls => classIds.includes(cls._id));
  };

  return (
    <div>
      <h2>All Students & Their Enrolled Classes</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((s) => (
          <div key={s._id} style={{ marginBottom: '30px' }}>
            <h4>{s.name} ({s.rollNumber})</h4>
            <ul>
              {s.classes.length === 0 ? (
                <li><em>No classes enrolled.</em></li>
              ) : (
                getEnrolledClasses(s.classes).map(cls => (
                  <li key={cls._id}>
                    {cls.name} - {cls.subject} ({cls.section})
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewStudents;
