import { Request } from 'express';
import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// CREATE STUDENT
const createStudent = async (req: Request): Promise<IGenericResponse> => {
  req.body.student.profileImage = req?.fileRelativePath || '';
  const { academicSemester, academicFaculty, academicDepartment } = req.body.student;

  try {
    // GET ACADEMIC SEMESTER
    const getAcademicSemester = await AuthService.get(
      `/academic-semesters?syncId=${academicSemester}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    // console.log({ getAcademicSemester });
    if (getAcademicSemester && Array.isArray(getAcademicSemester.data)) {
      req.body.student.academicSemester = getAcademicSemester?.data[0]?.id;
    }

    // GET ACADEMIC FACULTY
    const getAcademicFaculty = await AuthService.get(
      `/academic-faculties?syncId=${academicFaculty}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    // console.log({ getAcademicFaculty });
    if (getAcademicFaculty && Array.isArray(getAcademicFaculty.data)) {
      req.body.student.academicFaculty = getAcademicFaculty?.data[0]?.id;
    }

    // GET ACADEMIC DEPARTMENT
    const getAcademicDepartment = await AuthService.get(
      `/academic-departments?syncId=${academicDepartment}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    // console.log({ getAcademicDepartment });
    if (getAcademicDepartment && Array.isArray(getAcademicDepartment.data)) {
      //
      req.body.student.academicDepartment = getAcademicDepartment?.data[0]?.id;
    }
  } catch (error) {
    // console.log({ error: error?.response, errorData: error?.response?.data });
    throw new Error('Academic-Semester/Academic-Faculty/Academic-Department sync failed');
  }

  // console.log({ data: req.body });

  // CREATE STUDENT ON MONGODB
  const result: IGenericResponse = await AuthService.post('users/create-student', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// CREATE ADMIN
const createAdmin = async (req: Request): Promise<IGenericResponse> => {
  // SET PROFILE IMAGE
  req.body.admin.profileImage = req?.fileRelativePath || '';

  const { managementDepartment } = req.body.admin;
  try {
    // GET MANAGEMENT DEPARTMENT
    const getManagementDepartment = await AuthService.get(
      `/management-departments/${managementDepartment}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    // SET MANAGEMENT DEPARTMENT
    if (getManagementDepartment) {
      req.body.admin.managementDepartment = getManagementDepartment?.data?.id;
    }
  } catch (error) {
    // console.error({ error });
    throw new Error('Management-Department sync failed');
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
const createFaculty = async (req: Request): Promise<IGenericResponse> => {
  const { academicFaculty, academicDepartment } = req.body.faculty;

  // SET PROFILE IMAGE
  req.body.faculty.profileImage = req?.fileRelativePath || '';

  // console.log({ data: req.body });
  try {
    const facultyRes = await AuthService.get(`/academic-faculties?syncId=${academicFaculty}`, {
      headers: { authorization: req.headers.authorization }
    });
    // console.log('Faculty response:', facultyRes.data);

    if (facultyRes?.data?.length) {
      req.body.faculty.academicFaculty = facultyRes.data[0].id;
    }

    const deptRes = await AuthService.get(`/academic-departments?syncId=${academicDepartment}`, {
      headers: { Authorization: req.headers.authorization }
    });
    // console.log('Department response:', deptRes.data);

    if (deptRes?.data?.length) {
      req.body.faculty.academicDepartment = deptRes.data[0].id;
    }
  } catch (error) {
    console.error('Sync API error:', error);
    throw new Error('Faculty/Department sync failed');
  }

  // CREATE FACULTY ON MONGODB
  const result: IGenericResponse = await AuthService.post('users/create-faculty', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET ALL ADMIN
const getAllUsers = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/users`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET ADMIN BU ID
const getSingleUser = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/users/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE ADMIN
const updateUser = async (req: Request): Promise<any> => {
  const result = await AuthService.patch(`/users/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE ADMIN
const deleteUser = async (req: Request): Promise<any> => {
  const result = await AuthService.delete(`/users/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const UserServices = {
  createStudent,
  createAdmin,
  createFaculty,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
