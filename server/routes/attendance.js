const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/authMiddleware');

// Get attendance for a specific class and date
router.get('/:classId/:date', auth, async (req, res) => {
  const { classId, date } = req.params;
  try {
    const attendance = await Attendance.findOne({ classId, date: new Date(date) }).populate('records.studentId', 'name rollNumber');
    if (!attendance) return res.json({ records: [] });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching attendance' });
  }
});

// Mark or update attendance for a class and date
router.post('/', auth, async (req, res) => {
    const { classId, date, records } = req.body;
    try {
        let attendance = await Attendance.findOne({ classId, date });

        if (attendance) {
          attendance.records = records;
        } else {
          attendance = new Attendance({
            classId,
            date: new Date(date),
            records
          });
        }
  
      await attendance.save();
      res.json({ message: 'Attendance saved successfully' });
    } catch (err) {
      console.error('Error saving attendance:', err);
      res.status(500).json({ error: 'Error saving attendance' });
    }
  });

module.exports = router;
