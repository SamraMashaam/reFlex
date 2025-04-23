import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Grades = () => {
  const { classId } = useParams();
  const [assignmentType, setAssignmentType] = useState('');
  const [gradesList, setGradesList] = useState([]);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('rollNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  const [markFilter, setMarkFilter] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGradesAndStudents = async () => {
      try {
        const res = await axios.get(`/api/grades/${classId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGradesList(res.data);

        const classRes = await axios.get('/api/teacher/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cls = classRes.data.find((c) => c._id === classId);
        setStudents(cls.students);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGradesAndStudents();
  }, [classId, token]);

  const handleAssignmentSelect = () => {
  const type = assignmentType.trim();
  if (!type) return;

  const existing = gradesList.find(
        (g) => g.assignmentType === type
       );
  if (existing) {
    // Load today's grades
    setRecords(
      existing.grades.map((g) => ({
        studentId: g.studentId._id,
        name: g.studentId.name,
        rollNumber: g.studentId.rollNumber,
        marks: g.marks
      }))
    ); 
  } else {
    const proceed = window.confirm(
      `Assignment type "${type}" doesn't exist. Do you want to create it?`
    );
    if (!proceed) return;

    // New assignment type
    setRecords(
      students.map((s) => ({
        studentId: s._id,
        name: s.name,
        rollNumber: s.rollNumber,
        marks: 0
      }))
    );
  }
};

  const handleMarkChange = (index, value) => {
    const updated = [...records];
    updated[index].marks = parseInt(value) || 0;
    setRecords(updated);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        '/api/grades',
        {
          classId,
          assignmentType,
          date,
          grades: records.map((r) => ({
            studentId: r.studentId,
            marks: r.marks
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Grades saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save grades');
    }
  };

  return (
    <div className="page-container">
      <h2>Grades</h2>
      <label>Assignment Type: </label>
      <input
        type="text"
        value={assignmentType}
        onChange={(e) => setAssignmentType(e.target.value)}
        placeholder="e.g. Quiz 1"
      />
      <button onClick={handleAssignmentSelect}>Load</button>

      {records.length > 0 && (
        <>
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          <div className="filter-bar">
            <select value={markFilter} onChange={(e) => setMarkFilter(e.target.value)}>
              <option value="all">All Marks</option>
              <option value="above50">Above 50</option>
              <option value="below50">50 & Below</option>
            </select>

            <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="rollNumber">Roll Number</option>
              <option value="name">Name</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          </div>

          <table border="1" style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {records
                .filter((s) => {
                  const matchSearch =
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchMarks =
                    markFilter === 'all' ||
                    (markFilter === 'above50' && s.marks > 50) ||
                    (markFilter === 'below50' && s.marks <= 50);
                  return matchSearch && matchMarks;
                })
                .sort((a, b) => {
                  const valA = a[sortField].toLowerCase();
                  const valB = b[sortField].toLowerCase();
                  if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                  if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                  return 0;
                })
                .map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="number"
                        value={student.marks}
                        onChange={(e) => handleMarkChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button onClick={handleSave} style={{ marginTop: '20px' }}>
            Save Grades
          </button>
        </>
      )}
    </div>
  );
};

export default Grades;

