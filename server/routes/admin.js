const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');

// Middleware to simulate admin auth — replace with JWT if needed
const adminPasscode = process.env.ADMIN_PASSCODE || 'admin123';

const adminMiddleware = (req, res, next) => {
  const passcode = req.header('x-admin-passcode');
  if (passcode !== adminPasscode) {
    return res.status(403).json({ message: 'Unauthorized admin access' });
  }
  next();
};

// Add Teacher
router.post('/add-teacher', adminMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashed });
    await teacher.save();

    res.status(201).json({ message: 'Teacher added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding teacher' });
  }
});

// Add Student
router.post('/add-student', adminMiddleware, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding student', details: err.message });
  }
});

// Create Class
router.post('/create-class', adminMiddleware, async (req, res) => {
  try {
    const { name, subject, section, teacher } = req.body;
    const newClass = new Class({ name, subject, section, teacher });
    await newClass.save();
    res.status(201).json({ message: 'Class created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating class' });
  }
});

// Delete Class
router.delete('/delete-class/:id', adminMiddleware, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting class' });
  }
});

// Assign Class to Teacher
router.put('/assign-class', adminMiddleware, async (req, res) => {
  try {
    const { teacherId, classId } = req.body;
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    cls.teacher = teacherId;
    await cls.save();
    res.json({ message: 'Class assigned to teacher' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error assigning class' });
  }
});

// Unassign Class from Teacher
router.put('/unassign-class', adminMiddleware, async (req, res) => {
  try {
    const { classId } = req.body;
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    cls.teacher = undefined;
    await cls.save();
    res.json({ message: 'Class unassigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error unassigning class' });
  }
});

//  Enroll Student in Class
router.put('/enroll-student', adminMiddleware, async (req, res) => {
  const { studentId, classId } = req.body;
  try {
    const student = await Student.findById(studentId);
    const cls = await Class.findById(classId);

    if (!student || !cls) return res.status(404).json({ error: 'Student or class not found' });

    // Avoid duplicates
    if (!student.classes.includes(classId)) {
      student.classes.push(classId);
      await student.save();
    }

    if (!cls.students.includes(studentId)) {
      cls.students.push(studentId);
      await cls.save();
    }

    res.json({ message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

//  Unenroll Student from Class
router.put('/unenroll-student', adminMiddleware, async (req, res) => {
  const { studentId, classId } = req.body;
  try {
    await Student.findByIdAndUpdate(studentId, {
      $pull: { classes: classId }
    });

    await Class.findByIdAndUpdate(classId, {
      $pull: { students: studentId }
    });

    res.json({ message: 'Student unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unenroll student' });
  }
});


module.exports = router;
