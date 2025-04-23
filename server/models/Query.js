const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  type: { type: String, enum: ['attendance', 'grade'] },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  message: String,
  date: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Query', querySchema);
