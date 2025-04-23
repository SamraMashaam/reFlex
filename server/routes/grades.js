const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const Grade = require('../models/Grade');
const auth = require('../middleware/authMiddleware');

// Get grades for a class
router.get('/:classId', auth, async (req, res) => {
  try {
    const grades = await Grade.find({ classId: req.params.classId }).populate('grades.studentId', 'name rollNumber');
    res.json(grades);
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Save or update grade entry
router.post('/', auth, async (req, res) => {
  const { classId, assignmentType, date, grades } = req.body;
  try {
    let entry = await Grade.findOne({ classId, assignmentType, date });

    if (entry) {
      entry.grades = grades;
    } else {
      entry = new Grade({ classId, assignmentType, date, grades });
    }

    await entry.save();
    res.json({ message: 'Grades saved successfully' });
  } catch (err) {
    console.error('Error saving grades:', err);
    res.status(500).json({ error: 'Error saving grades' });
  }
});

module.exports = router;
