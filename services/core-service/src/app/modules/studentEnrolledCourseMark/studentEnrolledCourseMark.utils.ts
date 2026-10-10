import { Course, StudentEnrolledCourse } from '@prisma/client';

// CALCULATE GRADE FROM MARK
const getGradeFromMark = async (
  marks: number
): Promise<{ grade: string; points: number }> => {
  // DEFINE GRADE
  const result = {
    grade: '',
    points: 0,
  };
  if (marks && marks >= 80 && marks <= 100) {
    result.grade = 'A+';
    result.points = 4.0;
  } else if (marks && marks >= 70 && marks <= 79) {
    result.grade = 'A';
    result.points = 3.5;
  } else if (marks && marks >= 60 && marks <= 69) {
    result.grade = 'A-';
    result.points = 3.0;
  } else if (marks && marks >= 50 && marks <= 59) {
    result.grade = 'B';
    result.points = 2.5;
  } else if (marks && marks >= 40 && marks <= 49) {
    result.grade = 'C';
    result.points = 2.0;
  } else if (marks && marks >= 33 && marks <= 39) {
    result.grade = 'D';
    result.points = 2.0;
  } else {
    result.grade = 'F';
    result.points = 0.0;
  }

  return result;
};

//
const calcGradeAndCGPA = async (
  payload: (StudentEnrolledCourse & { course: Course })[]
): Promise<any> => {
  if (payload.length === 0) {
    return {
      cgpa: 0,
      totalCreditCompleted: 0,
    };
  }
  let totalCreditCompleted = 0;
  let totalPoints = 0;
  for (const item of payload) {
    totalCreditCompleted += item.course.credits || 0;
    totalPoints += item.points || 0;
  }
  const cgpa = Number((totalPoints / payload.length).toFixed(2));
  return {
    cgpa,
    totalCreditCompleted,
  };
};

// EXPORT GRADE FUNCTION
export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMark,
  calcGradeAndCGPA,
};
