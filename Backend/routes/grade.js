<<<<<<< HEAD
// routes/grade.js
=======
>>>>>>> d7704bc (Updates to frontend)
const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { calculateCourseGrade } = require('../utils/gradeCalculator');
const { calculateSGPA, calculateCGPA } = require('../utils/gpaCalculator');

// POST assignment grade and update transcript if all grades for a course are submitted
router.post('/grade', async (req, res) => {
  try {
    const { classId, studentId, assignmentType, marks, totalMarks, weightage } = req.body;

    // Save assignment grade
    const newGrade = new Grade({
      classId,
      studentId,
      assignmentType,
      marks,
      totalMarks,
      weightage,
      date: new Date(),
    });
    await newGrade.save();

    // Check if all grades for the course are submitted (e.g., total weightage = 100)
    const grades = await Grade.find({ classId, studentId });
    const totalWeight = grades.reduce((sum, grade) => sum + grade.weightage, 0);

    if (totalWeight >= 100) { // Assuming 100% weightage means course grading is complete
      const classData = await Class.findById(classId);
      const student = await Student.findById(studentId);

      // Calculate course grade and points
      const { grade, points } = calculateCourseGrade(grades);

      // Update transcript
      let semester = student.transcript.find((s) => s.semester === classData.semester);
      if (!semester) {
        semester = {
          semester: classData.semester,
          creditAttempted: 0,
          creditEarned: 0,
          sgpa: 0,
          courses: [],
        };
        student.transcript.push(semester);
      }

<<<<<<< HEAD
      // Check if course already exists in transcript (to avoid duplicates)
=======
      // Check if course already exists in transcript
>>>>>>> d7704bc (Updates to frontend)
      const courseExists = semester.courses.find((c) => c.code === classData.code);
      if (!courseExists) {
        semester.courses.push({
          code: classData.code,
          courseName: classData.name,
          section: classData.section,
          creditHours: classData.creditHours,
          grade,
          points,
          type: classData.type,
          remarks: grades.some((g) => g.stdDev) ? 'Interquartile Range Method' : '',
        });

        // Update credits
        semester.creditAttempted += classData.creditHours;
        if (points > 0) {
          semester.creditEarned += classData.creditHours;
        }

<<<<<<< HEAD
        // Recalculate SGPA
        semester.sgpa = calculateSGPA(semester.courses);

        // Recalculate CGPA
=======
        // Recalculate SGPA & CGPA
        semester.sgpa = calculateSGPA(semester.courses);
>>>>>>> d7704bc (Updates to frontend)
        student.currentCGPA = calculateCGPA(student.transcript);

        await student.save();
      }
    }

    res.json({ message: 'Grade added and transcript updated if applicable' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;