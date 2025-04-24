const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g., CS1002
  name: { type: String, required: true }, 
  section: { type: String, required: true }, // e.g., BCS-1E
  creditHours: { type: Number, required: true }, 
  type: { type: String, required: true, enum: ['Core', 'Elective'] }, 
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  semester: { type: String, required: true }, 
});

module.exports = mongoose.model('Class', classSchema);