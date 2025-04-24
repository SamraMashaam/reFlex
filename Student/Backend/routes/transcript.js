// routes/student.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { calculateSGPA, calculateCGPA } = require('../utils/gpaCalculator');
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
      arn: '2267355', // Replace with dynamic ARN if available
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