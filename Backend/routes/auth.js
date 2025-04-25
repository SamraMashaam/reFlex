const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const rateLimit = require('express-rate-limit');

// Rate limiter: max 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many login attempts, please try again after 15 minutes',
});

// Login endpoint
router.post('/login', loginLimiter, async (req, res) => {
    console.log('Login request:', req.body);
  const { rollNumber, password } = req.body;

  // Server-side validation
  if (!rollNumber || !password) {
    return res.status(400).json({ message: 'Roll number and password are required' });
  }

  if (!/^[0-9]{2}[A-Z]-[0-9]{4}$/.test(rollNumber)) {
    console.log('Invalid roll number format:', rollNumber);
    return res.status(400).json({ message: 'Invalid roll number format (e.g., 22I-0798)' });
  }

  try {
    const student = await Student.findOne({ rollNumber });
    console.log('Student found:', student ? student.rollNumber : 'None');
    if (!student) {
      return res.status(401).json({ message: 'Invalid roll number or password' });
    }

    const isMatch = await student.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid roll number or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { rollNumber: student.rollNumber },
      process.env.JWT_SECRET || 'your_jwt_secret', // Use .env in production
      { expiresIn: '1h' }
    );  
    console.log(token);
    res.json({ token, rollNumber: student.rollNumber });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;