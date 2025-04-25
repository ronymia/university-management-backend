const getGradeFromMark = async (
  mark: number
): Promise<{ grade: string; points: number }> => {
  // DEFINE GRADE
  const result = {
    grade: '',
    points: 0,
  };
  if (mark && mark >= 80 && mark <= 100) {
    result.grade = 'A+';
    result.points = 4.0;
  } else if (mark && mark >= 70 && mark <= 79) {
    result.grade = 'A';
    result.points = 3.5;
  } else if (mark && mark >= 60 && mark <= 69) {
    result.grade = 'A-';
    result.points = 3.0;
  } else if (mark && mark >= 50 && mark <= 59) {
    result.grade = 'B';
    result.points = 2.5;
  } else if (mark && mark >= 40 && mark <= 49) {
    result.grade = 'C';
    result.points = 2.0;
  } else if (mark && mark >= 33 && mark <= 39) {
    result.grade = 'D';
    result.points = 2.0;
  } else {
    result.grade = 'F';
    result.points = 0.0;
  }

  return result;
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMark,
};
