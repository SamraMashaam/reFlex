import React, { useState } from 'react';
import axios from 'axios';

const AddStudent = () => {
  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', password: '', degree: '', batch: '',
    section: '', campus: '', gender: '', dob: '', cnic: '', mobileNo: '',
    nationality: '', currentSemester: '', currentCGPA: '',
    sgpaPerSemester: [{ semester: '', sgpa: '' }],
    contactInfo: {
      permanent: { address: '', city: '', country: '', postalCode: '', phone: '' },
      current: { address: '', city: '', country: '', postalCode: '', phone: '' }
    },
    familyInfo: [{ relation: '', name: '', cnic: '', phone: '' }]
  });

  const token = 'admin123'; // temp admin passcode

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [section]: { ...prev.contactInfo[section], [field]: value }
      }
    }));
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...form.familyInfo];
    updated[index][field] = value;
    setForm({ ...form, familyInfo: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/add-student', form, {
        headers: { 'x-admin-passcode': token }
      });
      alert('Student added!');
    } catch (err) {
      alert('Error adding student');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <h4>Basic Info</h4>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="rollNumber" placeholder="Roll Number" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />

        <h4>Academic Info</h4>
        <input name="degree" placeholder="Degree" onChange={handleChange} />
        <input name="batch" placeholder="Batch" onChange={handleChange} />
        <input name="section" placeholder="Section" onChange={handleChange} />
        <input name="campus" placeholder="Campus" onChange={handleChange} />
        <input name="currentSemester" placeholder="Current Semester" onChange={handleChange} />
        <input name="currentCGPA" placeholder="Current CGPA" onChange={handleChange} />

        <h4>Personal Info</h4>
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input name="dob" type="date" onChange={handleChange} />
        <input name="cnic" placeholder="CNIC" onChange={handleChange} />
        <input name="mobileNo" placeholder="Mobile No." onChange={handleChange} />
        <input name="nationality" placeholder="Nationality" onChange={handleChange} />

        <h4>Permanent Address</h4>
        {["address", "city", "country", "postalCode", "phone"].map((field) => (
          <input
            key={field}
            placeholder={`Permanent ${field}`}
            onChange={(e) => handleNestedChange('permanent', field, e.target.value)}
          />
        ))}

        <h4>Current Address</h4>
        {["address", "city", "country", "postalCode", "phone"].map((field) => (
          <input
            key={field}
            placeholder={`Current ${field}`}
            onChange={(e) => handleNestedChange('current', field, e.target.value)}
          />
        ))}

        <h4>Family Info</h4>
        {form.familyInfo.map((member, i) => (
          <div key={i}>
            <select onChange={(e) => handleFamilyChange(i, 'relation', e.target.value)}>
              <option value="">Relation</option>
              <option>Father</option><option>Mother</option>
              <option>Guardian</option><option>Sibling</option><option>Spouse</option>
            </select>
            <input placeholder="Name" onChange={(e) => handleFamilyChange(i, 'name', e.target.value)} />
            <input placeholder="CNIC" onChange={(e) => handleFamilyChange(i, 'cnic', e.target.value)} />
            <input placeholder="Phone" onChange={(e) => handleFamilyChange(i, 'phone', e.target.value)} />
          </div>
        ))}

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
