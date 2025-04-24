import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, classRes] = await Promise.all([
          axios.get('/api/teacher'),
          axios.get('/api/class')
        ]);
        setTeachers(teacherRes.data);
        setClasses(classRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getTeacherClasses = (teacherId) => {
    return classes.filter(cls => cls.teacher?._id === teacherId);
  };

  return (
    <div>
      <h2>All Teachers & Their Assigned Classes</h2>
      {teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        teachers.map((t) => (
          <div key={t._id} style={{ marginBottom: '30px' }}>
            <h4>{t.name} ({t.email})</h4>
            <ul>
              {getTeacherClasses(t._id).length === 0 ? (
                <li><em>No classes assigned.</em></li>
              ) : (
                getTeacherClasses(t._id).map(cls => (
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

export default ViewTeachers;
