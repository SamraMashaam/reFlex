const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const attendanceRoutes = require('./routes/attendance');
const gradeRoutes = require('./routes/grades');
const queryRoutes = require('./routes/queries');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/queries', queryRoutes);

// Connect to DB
const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
