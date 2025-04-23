const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Class = require('../models/Class');

// Get classes for logged-in teacher
router.get('/classes', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.teacherId }).populate('students');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

module.exports = router;
