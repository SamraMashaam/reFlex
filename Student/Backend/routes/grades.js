const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grade = require('../models/Grade');
const Student = require('../models/Student');


// Helper function to convert numerical grade to grade point
const convertGradeToPoint = (marks) => {
  if (marks >= 90) return 4.0;
  if (marks >= 80) return 3.7;
  if (marks >= 70) return 3.3;
  if (marks >= 60) return 3.0;
  if (marks >= 50) return 2.7;
  if (marks >= 40) return 2.3;
  return 0.0;
};


// Fetch grades for a student in a class
router.get('/:classId/:rollNumber', async (req, res) => {
  const { classId, rollNumber } = req.params;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Convert classId to ObjectId
    const classObjectId = new mongoose.Types.ObjectId(classId);

    // Find grades records for the class and student
    const gradesDocs = await Grade.find({ classId: classObjectId });

    // Filter grades for this student
    const studentGrades = gradesDocs.map(doc => {
      const gradeRecord = doc.grades.find(grade => grade.studentId.toString() === student._id.toString());
      return {
        assignmentType: doc.assignmentType,
        date: doc.date,
        weightage: doc.weightage,
        totalMarks: doc.totalMarks,
        obtainedMarks: gradeRecord ? gradeRecord.marks : 0,
        minScore: doc.minScore,
        maxScore: doc.maxScore,
        stdDev: doc.stdDev,
      };
    });

    res.json(studentGrades);
  } catch (err) {
    console.error('Grades fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch grades.' });
  }
});

module.exports = router;
