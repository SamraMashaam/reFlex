import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ student }) => {
  const { rollNumber } = useParams();

  if (!student) return <div className="loading">Loading...</div>;

  // Prepare data for SGPA chart
  const sgpaData = student.sgpaPerSemester?.map((entry, index) => ({
    semester: entry.semester || `Sem ${index + 1}`,
    sgpa: entry.sgpa || 0,
  })) || [];

  return (
    <div className="main-content">
      <div className="dashboard fade-in">
        <h2>Hello, {student.name?.split(' ')[0]}!</h2>

        <div className="stats">
          <div className="Chart">
            <section className="info-card">
              <h4>Academic Progress</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sgpaData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="semester" stroke="var(--text)" />
                  <YAxis domain={[0, 4]} stroke="var(--text)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      borderRadius: '5px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--text)' }} />
                  <Line
                    type="monotone"
                    dataKey="sgpa"
                    stroke="var(--primary)"
                    activeDot={{ r: 8, fill: 'var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="notification-bar info-card">
            <h4>Notifications</h4>
            <ul>
              {student.notifications && student.notifications.length > 0 ? (
                student.notifications.map((note, i) => (
                  <li key={i}>
                    <strong>{new Date(note.date).toLocaleDateString()}:</strong> {note.message}
                  </li>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </ul>
          </section>
        </div>

        <div className="info-grid">
          <section className="info-card fade-in">
            <h4>Student Details</h4>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll Number:</strong> {student.rollNumber}</p>
            <p><strong>Email:</strong> {student.email}</p>
          </section>

          <section className="info-card fade-in">
            <h4>Academic Information</h4>
            <p><strong>Degree:</strong> {student.degree}</p>
            <p><strong>Batch:</strong> {student.batch}</p>
            <p><strong>Section:</strong> {student.section}</p>
            <p><strong>Campus:</strong> {student.campus}</p>
            <p><strong>Status:</strong> {student.status}</p>
            <p><strong>CGPA:</strong> {student.currentCGPA}</p>
            <p><strong>Semester:</strong> {student.currentSemester}</p>
          </section>

          <section className="info-card fade-in">
            <h4>Personal Information</h4>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>DOB:</strong> {student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
            <p><strong>CNIC:</strong> {student.cnic}</p>
            <p><strong>Mobile:</strong> {student.mobileNo}</p>
            <p><strong>Nationality:</strong> {student.nationality}</p>
          </section>

          <section className="info-card contact-info fade-in">
            <h4>Address</h4>
            <div className="address-grid">
              <div>
                <h5>Permanent</h5>
                <p>{student.contactInfo?.permanent?.address || 'N/A'}, {student.contactInfo?.permanent?.city || 'N/A'}</p>
              </div>
              <div>
                <h5>Current</h5>
                <p>{student.contactInfo?.current?.address || 'N/A'}, {student.contactInfo?.current?.city || 'N/A'}</p>
              </div>
            </div>
          </section>

          <section className="info-card family-info fade-in">
            <h4>Family Info</h4>
            <ul>
              {student.familyInfo?.length > 0 ? (
                student.familyInfo.map((member, i) => (
                  <li key={i}>{member.relation}: {member.name} - {member.phone}</li>
                ))
              ) : (
                <li>No family info available</li>
              )}
            </ul>
          </section>

          <section className="info-card classes-info fade-in">
            <h4>Classes</h4>
            <ul>
              {student.classes?.length > 0 ? (
                student.classes.map((cls, i) => (
                  <li key={i}>{cls.name || cls._id || 'N/A'}</li>
                ))
              ) : (
                <li>No classes enrolled</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;