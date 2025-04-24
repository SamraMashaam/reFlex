const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
    try {
      const students = await Student.find().select('-password');
      res.json(students);
    } catch (err) {
        console.log(err)
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });
  
  module.exports = router;