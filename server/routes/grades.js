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
  const { classId, assignmentType, date, weightage, totalMarks, grades } = req.body;

  try {
    // Calculate min, max, and stdDev
    const marksArray = grades.map(g => g.marks);
    const minScore = Math.min(...marksArray);
    const maxScore = Math.max(...marksArray);
    const avg = marksArray.reduce((a, b) => a + b, 0) / marksArray.length;
    const stdDev = Math.sqrt(
      marksArray.reduce((sum, mark) => sum + Math.pow(mark - avg, 2), 0) / marksArray.length
    );

    // Check if this assignment already exists for this class/date/type
    let entry = await Grade.findOne({ classId, assignmentType, date });

    if (entry) {
      entry.weightage = weightage;
      entry.totalMarks = totalMarks;
      entry.minScore = minScore;
      entry.maxScore = maxScore;
      entry.stdDev = stdDev;
      entry.grades = grades;
    } else {
      entry = new Grade({
        classId,
        assignmentType,
        date,
        weightage,
        totalMarks,
        minScore,
        maxScore,
        stdDev,
        grades
      });
    }

    await entry.save();
    res.json({ message: 'Grades saved successfully' });
  } catch (err) {
    console.error('Error saving grades:', err);
    res.status(500).json({ error: 'Error saving grades' });
  }
});


module.exports = router;
