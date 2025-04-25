const express = require('express');
const router = express.Router();
<<<<<<< HEAD
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
=======
const Student = require('../models/Student');
const authMiddleware = require('../middlewares/auth');

// Get student data
router.get('/:rollNumber', authMiddleware, async (req, res) => {
  if (!/^[0-9]{2}[A-Z]-[0-9]{4}$/.test(req.params.rollNumber)) {
    return res.status(400).json({ message: 'Invalid roll number format' });
  }
  
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
>>>>>>> d7704bc (Updates to frontend)
