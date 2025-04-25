<<<<<<< HEAD
// routes/student.js
=======
>>>>>>> d7704bc (Updates to frontend)
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { calculateSGPA, calculateCGPA } = require('../utils/gpaCalculator');
<<<<<<< HEAD
=======

>>>>>>> d7704bc (Updates to frontend)
// GET student transcript
router.get('/:rollNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Calculate CGPA from transcript
    const cgpa = calculateCGPA(student.transcript);

    res.json({
<<<<<<< HEAD
      arn: '2267355', // Replace with dynamic ARN if available
=======
      arn: '2267355', 
>>>>>>> d7704bc (Updates to frontend)
      rollNumber: student.rollNumber,
      name: student.name,
      batch: student.batch,
      cgpa,
      transcript: student.transcript,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;