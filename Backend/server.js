const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler.js");
const cors = require("cors");

<<<<<<< HEAD
=======
const authRoutes = require('./routes/auth.js');
>>>>>>> d7704bc (Updates to frontend)
const studentRoutes = require('./routes/student.js'); 
const studentAttendance = require('./routes/studentAttendance.js');
const studentGrades = require('./routes/grades.js');
const transcript = require('./routes/transcript.js');

const app = express();
app.use(cors());
app.use(express.json());

//Connect to Mongo
connectDB();

// Routes
<<<<<<< HEAD
=======
app.use('/api', authRoutes);
>>>>>>> d7704bc (Updates to frontend)
app.use('/api/student', studentRoutes);
app.use('/api/attendance',studentAttendance);
app.use('/api/grades', studentGrades);
app.use('/api/transcript', transcript);

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
