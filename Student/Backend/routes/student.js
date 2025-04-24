const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // adjust path if different

// GET student dashboard by roll number
router.get('/:rollNumber', async (req, res) => {
  try {
    console.log('Requested Roll Number:', req.params.rollNumber); 
    const student = await Student.findOne({ rollNumber: req.params.rollNumber }).populate('classes');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
