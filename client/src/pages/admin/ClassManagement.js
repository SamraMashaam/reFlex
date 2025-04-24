import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClassManagement = () => {
  const [form, setForm] = useState({ name: '', subject: '', section: '', teacher: '' });
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.teacher) delete payload.teacher; 
  
      await axios.post('/api/admin/create-class', payload, {
        headers: { 'x-admin-passcode': passcode }
      });
  
      alert('Class created!');
      setForm({ name: '', subject: '', section: '', teacher: '' });
      fetchData();
    } catch (err) {
      alert('Error creating class');
      console.error(err.response?.data || err);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await axios.delete(`/api/admin/delete-class/${id}`, {
        headers: { 'x-admin-passcode': passcode }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting class');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create a New Class</h2>
      <form onSubmit={handleCreate}>
        <input type="text" name="name" placeholder="Class Name" onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
        <input type="text" name="section" placeholder="Section" onChange={handleChange} required />
        <select name="teacher" onChange={handleChange}>
          <option value="">Assign Teacher (optional)</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.email})
            </option>
          ))}
        </select>
        <button type="submit">Create Class</button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Existing Classes</h2>
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Subject</th>
            <th>Section</th>
            <th>Teacher</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls._id}>
              <td>{cls.name}</td>
              <td>{cls.subject}</td>
              <td>{cls.section}</td>
              <td>{cls.teacher? cls.teacher.name : 'Unassigned'}</td>
              <td>
                <button onClick={() => handleDelete(cls._id)} style={{ backgroundColor: '#dc3545' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassManagement;
