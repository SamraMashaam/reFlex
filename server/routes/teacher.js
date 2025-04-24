const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

// Get classes for logged-in teacher
router.get('/classes', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.teacherId }).populate('students');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});


module.exports = router;
