// src/components/Transcript.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Transcript = () => {
  const { rollNumber } = useParams();
  const [transcriptData, setTranscriptData] = useState(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transcript/${rollNumber}`);
        setTranscriptData(response.data);
      } catch (error) {
        console.error('Error fetching transcript:', error);
      }
    };
    fetchTranscript();
  }, [rollNumber]);

  if (!transcriptData) return <div className="loading">Loading...</div>;

  return (
    <div className="main-content">
      <div className="transcript-container fade-in">
        <h1>Transcript</h1>
        <div className="student-info">
          <div className="student-info-grid">
            <p><strong>ARN:</strong> {transcriptData.arn}</p>
            <p><strong>Roll No:</strong> {transcriptData.rollNumber}</p>
            <p><strong>Name:</strong> {transcriptData.name}</p>
            <p><strong>Batch:</strong> {transcriptData.batch}</p>
            <p><strong>CGPA:</strong> {transcriptData.cgpa}</p>
          </div>
        </div>

        {transcriptData.transcript.map((semester, index) => (
          <div key={index} className="semester-section fade-in">
            <h2 className="semester-title">{semester.semester}</h2>
            <div className="semester-stats">
              <p>
                <strong>Cr. Att:</strong> {semester.creditAttempted} &nbsp;
                <strong>Cr. Ernd:</strong> {semester.creditEarned} &nbsp;
                <strong>SGPA:</strong> {semester.sgpa}
              </p>
            </div>
            <table className="transcript-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Section</th>
                  <th>Cr.Hrs</th>
                  <th>Grade</th>
                  <th>Points</th>
                  <th>Type</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {semester.courses.map((course, idx) => (
                  <tr key={idx}>
                    <td>{course.code}</td>
                    <td>{course.courseName}</td>
                    <td>{course.section}</td>
                    <td>{course.creditHours}</td>
                    <td>{course.grade}</td>
                    <td>{course.points.toFixed(2)}</td>
                    <td>{course.type}</td>
                    <td>{course.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transcript;