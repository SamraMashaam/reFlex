const mongoose = require('mongoose');
const Student = require('../models/Student');

mongoose.connect('mongodb://localhost:27017/reFlex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const students = await Student.find();
  for (const student of students) {
    const newRollNumber = '22I-0798'; // Replace with dynamic logic if needed
    if (student.rollNumber !== newRollNumber) {
      student.rollNumber = newRollNumber;
      await student.save();
      console.log(`Updated roll number for ${student.name} to ${newRollNumber}`);
    }
  }
  console.log('All student roll numbers updated');
  mongoose.disconnect();
}).catch(err => console.error('Error:', err));