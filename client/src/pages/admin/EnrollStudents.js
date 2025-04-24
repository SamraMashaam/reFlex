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


const EnrollStudents = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [message, setMessage] = useState('');

  const passcode = 'admin123';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [classRes, studentRes] = await Promise.all([
          axios.get('/api/class'),
          axios.get('/api/student')
        ]);
        setClasses(classRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleClassChange = (id) => {
    const cls = classes.find((c) => c._id === id);
    setSelectedClass(cls);
    setEnrolled(cls.students || []);
    setMessage('');
  };

  const handleEnroll = async (studentId) => {
    try {
      await axios.put(
        '/api/admin/enroll-student',
        { studentId, classId: selectedClass._id },
        { headers: { 'x-admin-passcode': passcode } }
      );
      setMessage('Student enrolled!');
      updateEnrolledList(selectedClass._id);
    } catch (err) {
      console.error(err);
      setMessage('Failed to enroll student.');
    }
  };

  const handleUnenroll = async (studentId) => {
    try {
      await axios.put(
        '/api/admin/unenroll-student',
        { studentId, classId: selectedClass._id },
        { headers: { 'x-admin-passcode': passcode } }
      );
      setMessage('Student unenrolled.');
      updateEnrolledList(selectedClass._id);
    } catch (err) {
      console.error(err);
      setMessage('Failed to unenroll student.');
    }
  };

  const updateEnrolledList = async (classId) => {
    try {
      const res = await axios.get('/api/class');
      const updated = res.data.find((c) => c._id === classId);
      setSelectedClass(updated);
      setEnrolled(updated.students || []);
    } catch (err) {
      console.error('Failed to refresh class data.');
    }
  };

  const isEnrolled = (studentId) =>
    enrolled.some((s) => s._id === studentId);

  return (
    <div>
      <h2>Enroll/Unenroll Students</h2>

      <select onChange={(e) => handleClassChange(e.target.value)}>
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} - {c.subject} ({c.section})
          </option>
        ))}
      </select>

      {message && (
        <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#007bff' }}>{message}</p>
      )}

      {selectedClass && (
        <>
          <h3 style={{ marginTop: '30px' }}>
            Students in {selectedClass.name} ({selectedClass.subject})
          </h3>
          {enrolled.length === 0 ? (
            <p><em>No students enrolled yet.</em></p>
          ) : (
            <ul>
              {enrolled.map((s) => (
                <li key={s._id}>
                  {s.name} ({s.rollNumber})
                  <HoverButton onClick={() => handleUnenroll(s._id)}>Unenroll</HoverButton>
                </li>
              ))}
            </ul>
          )}

          <h3 style={{ marginTop: '30px' }}>Enroll New Student</h3>
          {students.filter((s) => !isEnrolled(s._id)).length === 0 ? (
            <p><em>All students already enrolled.</em></p>
          ) : (
            <ul>
              {students
                .filter((s) => !isEnrolled(s._id))
                .map((s) => (
                  <li key={s._id}>
                    {s.name} ({s.rollNumber})
                    <button
                      onClick={() => handleEnroll(s._id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Enroll
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

export default EnrollStudents;
