import { Request } from 'express';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { IUploadFille } from '../../../interfaces/file';
import { AuthService } from '../../../shared/axios';

// CREATE STUDENT
const createStudent = async (req: Request): Promise<any> => {
  const file = req.file as IUploadFille;
  // console.log({ uploadImage: file });
  // const uploadImage = await FileUploadHelper.uploadToCloudinary(file);
  console.log({ uploadImage: file });
  // console.log('after', {
  //   guardian: req.body.student.guardian,
  //   localGuardian: req.body.student.localGuardian
  // });

  req.body.student.profileImage = file.path;
  const { academicSemester, academicFaculty, academicDepartment } = req.body.student;

  const getAcademicSemester = await AuthService.get(
    `/academic-semesters?syncId=${academicSemester}`
  );

  //
  if (getAcademicSemester && Array.isArray(getAcademicSemester.data)) {
    req.body.student.academicSemester = getAcademicSemester?.data[0]?.id;
  }

  //
  const getAcademicFaculty = await AuthService.get(`/academic-faculties?syncId=${academicFaculty}`);
  if (getAcademicFaculty && Array.isArray(getAcademicFaculty.data)) {
    req.body.student.academicFaculty = getAcademicFaculty?.data[0]?.id;
  }

  // GET
  const getAcademicDepartment = await AuthService.get(
    `/academic-departments?syncId=${academicDepartment}`
  );
  if (getAcademicDepartment && Array.isArray(getAcademicDepartment.data)) {
    //
    req.body.student.academicDepartment = getAcademicDepartment?.data[0]?.id;
  }

  // console.log('after', {
  //   guardian: req.body.student.guardian,
  //   localGuardian: req.body.student.localGuardian
  // });
  const result = await AuthService.post('users/create-student', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT SERVICES
export const UserServices = {
  createStudent
};
