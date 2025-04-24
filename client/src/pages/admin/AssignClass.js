import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HoverButton = ({ onClick, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        marginLeft: '10px',
        backgroundColor: hover ? '#a71d2a' : '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

const AssignClass = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teacherClasses, setTeacherClasses] = useState([]);

  const passcode = 'admin123';

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSelectTeacher = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacher(teacherId);

    const assigned = classes.filter(cls => cls.teacher?._id === teacherId);
    setTeacherClasses(assigned);
  };

  const handleAssign = async (classId) => {
    try {
      await axios.put('/api/admin/assign-class', {
        teacherId: selectedTeacher,
        classId
      }, {
        headers: { 'x-admin-passcode': passcode }
      });
      fetchData();
      alert('Class assigned!');
    } catch (err) {
      console.error(err);
      alert('Error assigning class');
    }
  };


  const handleUnassign = async (classId) => {
    try {
      await axios.put('/api/admin/unassign-class', { classId }, {
        headers: { 'x-admin-passcode': passcode }
      });
      fetchData();
      alert('Class unassigned!');
    } catch (err) {
      console.error(err);
      alert('Error unassigning class');
    }
  };

  const unassignedClasses = classes.filter(cls => !cls.teacher);

  return (
    <div>
      <h2>Assign/Unassign Classes</h2>

      <select onChange={handleSelectTeacher} value={selectedTeacher}>
        <option value="">Select a Teacher</option>
        {teachers.map((t) => (
          <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
        ))}
      </select>

      {selectedTeacher && (
        <>
          <h3 style={{ marginTop: '30px' }}>Currently Assigned Classes</h3>
          {teacherClasses.length === 0 ? (
            <p>No classes assigned yet.</p>
          ) : (
            <ul>
              {teacherClasses.map(cls => (
                <li key={cls._id}>
                  {cls.name} - {cls.subject} ({cls.section})
                  <HoverButton
                    onClick={() => handleUnassign(cls._id)}
                  >
                    Unassign
                  </HoverButton>
                </li>
              ))}
            </ul>
          )}

          <h3 style={{ marginTop: '30px' }}>Available Classes</h3>
          {unassignedClasses.length === 0 ? (
            <p>No unassigned classes available.</p>
          ) : (
            <ul>
              {unassignedClasses.map(cls => (
                <li key={cls._id}>
                  {cls.name} - {cls.subject} ({cls.section})
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleAssign(cls._id)}
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AssignClass;
