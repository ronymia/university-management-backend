import { Request } from 'express';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { IUploadFille } from '../../../interfaces/file';
import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// CREATE STUDENT
const createStudent = async (req: Request): Promise<any> => {
  const file = req.file as IUploadFille;
  // console.log({ uploadImage: file });
  // const uploadImage = await FileUploadHelper.uploadToCloudinary(file);
  // console.log({ uploadImage: file });

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

  // CREATE STUDENT ON MONGODB
  const result = await AuthService.post('users/create-student', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// CREATE ADMIN
const createAdmin = async (req: Request): Promise<IGenericResponse> => {
  const file = req.file as IUploadFille;
  console.log({ file });
  // const uploadImage = await FileUploadHelper.uploadToCloudinary(file);
  // console.log({ uploadImage });

  // SET PROFILE IMAGE
  req.body.admin.profileImage = file.path;

  // GET MANAGEMENT DEPARTMENT
  const { managementDepartment } = req.body.admin;

  // GET MANAGEMENT DEPARTMENT
  const getManagementDepartment = await AuthService.get(
    `/management-departments/${managementDepartment}`
  );

  // SET MANAGEMENT DEPARTMENT
  if (getManagementDepartment) {
    req.body.admin.managementDepartment = getManagementDepartment?.data?.id;
  }
  // CREATE ADMIN ON MONGODB
  const result: IGenericResponse = await AuthService.post('users/create-admin', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN DATA
  return result;
};

// CREATE FACULTY
const createFaculty = async (req: Request): Promise<any> => {
  // CREATE FACULTY ON MONGODB
  const result = await AuthService.post('users/create-admin', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT SERVICES
export const UserServices = {
  createStudent,
  createAdmin,
  createFaculty
};
