const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  assignmentType: String,
  date: Date,
  weightage: Number,
  totalMarks: Number,
  minScore: Number,
  maxScore: Number,
  stdDev: Number,
  grades: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    marks: Number
  }]
});


module.exports = mongoose.model('Grade', gradeSchema);
