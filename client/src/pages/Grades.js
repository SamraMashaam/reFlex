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

  const [weightage, setWeightage] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [stdDev, setStdDev] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, classesRes] = await Promise.all([
          axios.get(`/api/grades/${classId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`/api/teacher/classes`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setGradesList(gradesRes.data);
        const cls = classesRes.data.find((c) => c._id === classId);
        setStudents(cls.students);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [classId, token]);

  const handleAssignmentSelect = () => {
    const existing = gradesList.find(
      (g) => g.assignmentType === assignmentType
    );

    if (existing) {
      setWeightage(existing.weightage);
      setTotalMarks(existing.totalMarks);
      setMinScore(existing.minScore);
      setMaxScore(existing.maxScore);
      setStdDev(existing.stdDev.toFixed(2));
      setRecords(
        existing.grades.map((g) => ({
          studentId: g.studentId._id,
          name: g.studentId.name,
          rollNumber: g.studentId.rollNumber,
          marks: g.marks
        }))
      );
    } else {
      setWeightage('');
      setTotalMarks('');
      setMinScore(0);
      setMaxScore(0);
      setStdDev(0);
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
          weightage: parseFloat(weightage),
          totalMarks: parseFloat(totalMarks),
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
      <input
        type="text"
        placeholder="Assignment Type (e.g. Quiz 1)"
        value={assignmentType}
        onChange={(e) => setAssignmentType(e.target.value)}
      />
      <button onClick={handleAssignmentSelect}>Load</button>

      {records.length > 0 && (
        <>
          <div>
            <input
              type="number"
              placeholder="Weightage (%)"
              value={weightage}
              onChange={(e) => setWeightage(e.target.value)}
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />
          </div>

          {/* Show calculated values if viewing existing */}
          {minScore !== 0 && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Min:</strong> {minScore} | <strong>Max:</strong> {maxScore} | <strong>Std Dev:</strong> {stdDev}
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((student, index) => (
                <tr key={student.studentId}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>
                    <div>
                    <input
                      type="number"
                      value={student.marks}
                      onChange={(e) => handleMarkChange(index, e.target.value)}
                    />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            <button style={{ marginTop: '20px' }} onClick={handleSave}>
              Save Grades
            </button>
          
        </>
      )}
    </div>
  );
};

export default Grades;
