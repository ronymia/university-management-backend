import { Request } from 'express';
import { AuthService, CoreService as HttpService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// GET ALL FACULTY
const getAllFacultiesFromCore = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/faculties`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET ALL FACULTY
const getAllFaculties = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.get(`/faculties`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET FACULTY BY ID
const getSingleFaculty = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.get(`/faculties/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE FACULTY
const updateFaculty = async (req: Request): Promise<IGenericResponse> => {
  const { academicFaculty, academicDepartment } = req.body;
  try {
    const facultyRes = await AuthService.get(`/academic-faculties?syncId=${academicFaculty}`, {
      headers: { authorization: req.headers.authorization }
    });
    // console.log('Faculty response:', facultyRes.data);

    if (facultyRes?.data?.length) {
      req.body.academicFaculty = facultyRes.data[0].id;
    }

    const deptRes = await AuthService.get(`/academic-departments?syncId=${academicDepartment}`, {
      headers: { Authorization: req.headers.authorization }
    });
    // console.log('Department response:', deptRes.data);

    if (deptRes?.data?.length) {
      req.body.academicDepartment = deptRes.data[0].id;
    }
  } catch (error) {
    console.error('Sync API error:', error);
    throw new Error('Faculty/Department sync failed');
  }

  // MADE REQUEST for update
  const result: IGenericResponse = await AuthService.patch(
    `/faculties/${req.params.id}`,
    req.body,
    {
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );

  // RETURN
  return result;
};

// DELETE FACULTY
const deleteFaculty = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.delete(`/faculties/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
const assignCourses = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.post(
    `/faculties/${req.params.id}/assigned-courses`,
    req.body,
    {
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );

  // RETURN
  return result;
};
const removeCourses = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.patch(
    `/faculties/${req.params.id}/remove-courses`,
    req.body,
    {
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );

  // RETURN
  return result;
};

// GET ALL FACULTY
const myCourses = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/faculties/my-courses`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET ALL FACULTY
const getMyCourseStudents = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/faculties/my-course-students`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const FacultyServices = {
  getAllFacultiesFromCore,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents
};
