const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// routes/class.js
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'name email')
      .populate('students', 'name rollNumber');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

  
module.exports = router;