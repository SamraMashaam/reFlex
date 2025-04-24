// utils/gpaCalculator.js
const calculateSGPA = (courses) => {
    let totalPoints = 0;
    let totalCreditHours = 0;
  
    courses.forEach((course) => {
      totalPoints += course.points * course.creditHours;
      totalCreditHours += course.creditHours;
    });
  
    return totalCreditHours > 0 ? (totalPoints / totalCreditHours).toFixed(2) : 0;
  };
  
  const calculateCGPA = (semesters) => {
    let totalPoints = 0;
    let totalCreditHours = 0;
  
    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        totalPoints += course.points * course.creditHours;
        totalCreditHours += course.creditHours;
      });
    });
  
    return totalCreditHours > 0 ? (totalPoints / totalCreditHours).toFixed(2) : 0;
  };
  
  module.exports = { calculateSGPA, calculateCGPA };