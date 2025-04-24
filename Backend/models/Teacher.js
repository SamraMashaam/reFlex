const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});

module.exports = mongoose.model('Teacher', teacherSchema);
