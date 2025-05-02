import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

const createOfferedCourseClassSchedule = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/offered-course-class-schedules', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getAllOfferedCourseClassSchedules = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/offered-course-class-schedules', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getSingleOfferedCourseClassSchedule = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/offered-course-class-schedules/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const updateOfferedCourseClassSchedule = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(
    `/offered-course-class-schedules/${req.params.id}`,
    req.body,
    {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization
      }
    }
  );

  // RETURN
  return result;
};

const deleteOfferedCourseClassSchedule = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/offered-course-class-schedules/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const OfferedCourseClassScheduleServices = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule
};
