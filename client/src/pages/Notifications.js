import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [queries, setQueries] = useState([]);
  const token = localStorage.getItem('token');

  const fetchQueries = async () => {
    try {
      const res = await axios.get('/api/queries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resolveQuery = async (id) => {
    try {
      await axios.put(`/api/queries/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQueries(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="page-container">
      <h2>Notifications</h2>
      {queries.length === 0 ? (
        <p>No queries at the moment.</p>
      ) : (
        <ul>
          {queries.map((q) => (
            <li key={q._id} style={{ marginBottom: '15px' }}>
              <strong>{q.type.toUpperCase()} Query</strong><br />
              From: {q.studentId?.name} ({q.studentId?.rollNumber})<br />
              Class: {q.classId?.name}<br />
              Message: {q.message}<br />
              <button onClick={() => resolveQuery(q._id)}>Mark as Resolved</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
