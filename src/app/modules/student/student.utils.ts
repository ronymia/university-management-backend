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
