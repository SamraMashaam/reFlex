<<<<<<< HEAD
// utils/gradeCalculator.js
=======
>>>>>>> d7704bc (Updates to frontend)
const calculateCourseGrade = (grades, totalWeightage = 100) => {
    let totalWeightedMarks = 0;
    let totalWeight = 0;
  
    grades.forEach((grade) => {
      const weightedMarks = (grade.marks / grade.totalMarks) * grade.weightage;
      totalWeightedMarks += weightedMarks;
      totalWeight += grade.weightage;
    });
  
    const finalMarks = totalWeight > 0 ? (totalWeightedMarks / totalWeight) * 100 : 0;
  
<<<<<<< HEAD
    // Example grading scale (adjust as per your institution's policy)
=======
    // Grading scale 
>>>>>>> d7704bc (Updates to frontend)
    if (finalMarks >= 90) return { grade: 'A+', points: 4.0 };
    if (finalMarks >= 85) return { grade: 'A', points: 4.0 };
    if (finalMarks >= 80) return { grade: 'A-', points: 3.67 };
    if (finalMarks >= 75) return { grade: 'B+', points: 3.33 };
    if (finalMarks >= 70) return { grade: 'B', points: 3.0 };
    if (finalMarks >= 65) return { grade: 'B-', points: 2.67 };
    if (finalMarks >= 60) return { grade: 'C+', points: 2.33 };
    if (finalMarks >= 55) return { grade: 'C', points: 2.0 };
    if (finalMarks >= 50) return { grade: 'C-', points: 1.67 };
    if (finalMarks >= 45) return { grade: 'D+', points: 1.33 };
    if (finalMarks >= 40) return { grade: 'D', points: 1.0 };
    return { grade: 'F', points: 0 };
  };
  
  module.exports = { calculateCourseGrade };