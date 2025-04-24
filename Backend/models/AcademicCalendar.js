const mongoose = require('mongoose');

const academicCalendarSchema = new mongoose.Schema({
  semester: String,
  events: [{
    name: String, // e.g., "Registration", "Classes"
    startDate: Date, 
    endDate: Date,
    description: String
  }]
});

module.exports = mongoose.model('AcademicCalendar', academicCalendarSchema);