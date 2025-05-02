import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE OFFERED COURSE SECTION
const createOfferedCourseSection = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/offered-course-sections', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE OFFERED COURSE SECTION
const getSingleOfferedCourseSection = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/offered-course-sections/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL OFFERED COURSE SECTION
const getAllOfferedCourseSections = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/offered-course-sections', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE OFFERED COURSE SECTION
const updateOfferedCourseSection = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/offered-course-sections/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE OFFERED COURSE SECTION
const deleteOfferedCourseSection = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/offered-course-sections/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const OfferedCourseSectionServices = {
  createOfferedCourseSection,
  getSingleOfferedCourseSection,
  getAllOfferedCourseSections,
  updateOfferedCourseSection,
  deleteOfferedCourseSection
};
