const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  assignmentType: String, // Quiz, Exam, etc.
  date: Date,
  grades: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    marks: Number
  }]
});

module.exports = mongoose.model('Grade', gradeSchema);
