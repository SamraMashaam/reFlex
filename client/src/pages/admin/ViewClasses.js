import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewClasses = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/class');
        setClasses(res.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h2>All Classes with Student & Teacher Data</h2>
      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        classes.map((cls) => (
          <div key={cls._id} style={{ marginBottom: '30px' }}>
            <h4>
              {cls.name} - {cls.subject} ({cls.section})
            </h4>
            <p>
              <strong>Teacher:</strong>{' '}
              {cls.teacher ? `${cls.teacher.name} (${cls.teacher.email})` : 'Unassigned'}
            </p>

            <p>
              <strong>Students:</strong>
            </p>
            {cls.students?.length === 0 ? (
              <p><em>No students enrolled.</em></p>
            ) : (
              <ul>
                {cls.students.map((s) => (
                  <li key={s._id}>{s.name} ({s.rollNumber})</li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewClasses;
