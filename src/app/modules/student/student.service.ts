import { Request } from 'express';
import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// GET ALL STUDENT
const getAllStudents = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.get(`/students`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET STUDENT BY ID
const getSingleStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.get(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE STUDENT
const updateStudent = async (req: Request): Promise<IGenericResponse> => {
  const { academicSemester, academicFaculty, academicDepartment } = req.body;

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
      req.body.academicSemester = getAcademicSemester?.data[0]?.id;
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
      req.body.academicFaculty = getAcademicFaculty?.data[0]?.id;
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
      req.body.academicDepartment = getAcademicDepartment?.data[0]?.id;
    }
  } catch (error) {
    // console.log({ error: error?.response, errorData: error?.response?.data });
    throw new Error('Academic-Semester/Academic-Faculty/Academic-Department sync failed');
  }

  //
  const result: IGenericResponse = await AuthService.patch(`/students/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE STUDENT
const deleteStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.delete(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent
};
