const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Query = require('../models/Query');
const Student = require('../models/Student');

// Get all unresolved queries for a teacher's classes
router.get('/', auth, async (req, res) => {
  try {
    const teacherId = req.teacherId;

    const queries = await Query.find({ resolved: false })
      .populate('studentId', 'name rollNumber email')
      .populate('classId', 'name teacher');

    // Filter queries by teacher-owned classes
    const teacherQueries = queries.filter(
      (q) => q.classId && q.classId.teacher.toString() === teacherId
    );

    res.json(teacherQueries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// Resolve a query
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });

    query.resolved = true;
    await query.save();

    res.json({ message: 'Query resolved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve query' });
  }
});

module.exports = router;
