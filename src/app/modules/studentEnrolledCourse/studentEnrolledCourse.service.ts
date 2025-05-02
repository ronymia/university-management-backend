import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE STUDENT ENROLLED COURSE
const createStudentEnrolledCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/student-enrolled-courses', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getAllStudentEnrolledCourses = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-enrolled-courses`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET SINGLE STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-enrolled-courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.Authorization
    }
  });
  return result;
};

// UPDATE STUDENT ENROLLED COURSE
const updateStudentEnrolledCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/student-enrolled-courses/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE STUDENT ENROLLED COURSE
const deleteStudentEnrolledCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/student-enrolled-courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const StudentEnrolledCourseServices = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourses,
  getSingleStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse
};
