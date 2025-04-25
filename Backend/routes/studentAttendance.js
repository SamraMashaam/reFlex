const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Class = require('../models/Class')
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// GET student attendance by roll number & class ID
router.get('/:classId/:rollNumber', async (req, res) => {
  const { classId, rollNumber } = req.params;

  try {
    //Find Student
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    let classObjectId;
    try {
    classObjectId = new mongoose.Types.ObjectId(classId);
    } catch (err) {
    return res.status(400).json({ error: 'Invalid class ID format.' });
    }

    //get Attendance records 
    const attendanceDocs = await Attendance.find({ classId: classObjectId });

    //Filter attendance for this student
    const studentAttendance = attendanceDocs.map(doc => {
      const record = doc.records.find(r => r.studentId.toString() === student._id.toString());
      return {
        date: doc.date,
        status: record ? record.status : 'absent'
      };
    });
   

    res.json(studentAttendance);
  } catch (err) {
    console.error('Attendance fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
});

module.exports = router;
