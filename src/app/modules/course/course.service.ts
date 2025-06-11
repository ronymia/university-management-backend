import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE COURSE
const createCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/courses', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE COURSE
const getSingleCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET ALL COURSE
const getAllCourses = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/courses', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE COURSE
const updateCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/courses/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE COURSE
const deleteCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// ASSIGN FACULTIES
const assignFaculties = async (req: Request): Promise<any> => {
  const result = await HttpService.post(`/courses/${req.params.id}/assigned-faculties`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// REMOVE FACULTIES
const removeFaculties = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/courses/${req.params.id}/remove-faculties`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const CourseServices = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties
};
