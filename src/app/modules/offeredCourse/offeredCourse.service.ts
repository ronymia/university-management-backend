import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE OFFERED COURSE
const createOfferedCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/offered-courses', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE OFFERED COURSE
const getSingleOfferedCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/offered-courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL OFFERED COURSE
const getAllOfferedCourses = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/offered-courses', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE OFFERED COURSE
const updateOfferedCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/offered-courses/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE OFFERED COURSE
const deleteOfferedCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/offered-courses/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const OfferedCourseServices = {
  createOfferedCourse,
  getSingleOfferedCourse,
  getAllOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourse
};
