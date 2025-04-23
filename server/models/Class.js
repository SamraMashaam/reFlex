const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: String,
  subject: String,
  section: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Class', classSchema);
