// STUDENT
// export const findLastStudentId = async (): Promise<string | undefined> => {
//   const lastStudent = await User.findOne(
//     { role: ENUM_USER_ROLE.STUDENT },
//     { id: 1, _id: 0 }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
// };

// export const generateStudentId = async (
//   academicSemester: AcademicSemester | null
// ): Promise<string> => {
//   const currentId =
//     (await findLastStudentId()) || (0).toString().padStart(5, '0'); //00000
//   //increment by 1
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');

//   incrementedId = `${academicSemester?.year.substring(2)}${
//     academicSemester?.code
//   }${incrementedId}`;

//   return incrementedId;
// };

const getAvailableCourses = async (
  offeredCourses: any,
  studentCompletedCourses: any,
  studentCurrentlyTakenCourses: any
) => {
  const completedCourseIds = studentCompletedCourses.map(
    (completedCourse: any) => completedCourse.courseId
  );

  const availableCourses = offeredCourses
    .filter((course: any) => !completedCourseIds.includes(course.id))
    .filter((course: any) => {
      const preRequisiteCourses = course.course.preRequisiteCourses || [];

      if (preRequisiteCourses.length === 0) {
        return true; // No prerequisites, course is available
      } else {
        const preRequisiteCourseIds = preRequisiteCourses.map(
          (preRequisiteCourse: any) => preRequisiteCourse.preRequisiteId
        );

        return preRequisiteCourseIds.every((id: string) =>
          completedCourseIds.includes(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTaken = studentCurrentlyTakenCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (isAlreadyTaken) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTaken.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return { ...course, isTaken: true };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });
        return { ...course, isTaken: false };
      }
    });

  return availableCourses;
};

export const StudentUtils = {
  getAvailableCourses,
};
