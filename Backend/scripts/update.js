const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

mongoose.connect('mongodb://localhost:27017/reFlex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const students = await Student.find();
  for (const student of students) {
    student.password  = 'Password123!';
    console.log(`${student.password}`);
    await student.save();
  }
  console.log('Students updated with passwords');
  mongoose.disconnect();
}).catch(err => console.error(err));