import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Attendance = () => {
  const { classId } = useParams();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('rollNumber');
  const [sortOrder, setSortOrder] = useState('asc');

  const token = localStorage.getItem('token');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`/api/attendance/${classId}/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.records && res.data.records.length > 0) {
        setRecords(
          res.data.records.map((r) => ({
            studentId: r.studentId._id,
            name: r.studentId.name,
            rollNumber: r.studentId.rollNumber,
            status: r.status
          }))
        );
      } else {
        const classRes = await axios.get(`/api/teacher/classes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cls = classRes.data.find((c) => c._id === classId);
        setStudents(cls.students);
        setRecords(
          cls.students.map((s) => ({
            studentId: s._id,
            name: s.name,
            rollNumber: s.rollNumber,
            status: 'absent'
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (index) => {
    const updated = [...records];
    updated[index].status = updated[index].status === 'present' ? 'absent' : 'present';
    setRecords(updated);
  };

  const handleSave = async () => {
    try {
      await axios.post(
        '/api/attendance',
        {
          classId,
          date,
          records: records.map((r) => ({
            studentId: r.studentId,
            status: r.status
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Attendance saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save attendance');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  return (
    <div className='page-container'>
      <h2>Attendance</h2>
      <label>Select Date: </label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      <div className="filter-bar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records
            .filter((s) => {
              const matchSearch =
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
              const matchFilter =
                filterStatus === 'all' || s.status === filterStatus;
              return matchSearch && matchFilter;
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
                  <button onClick={() => handleToggle(index)}>
                    {student.status}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button onClick={handleSave} style={{ marginTop: '20px' }}>
        Save Attendance
      </button>
    </div>
  );
};

export default Attendance;
