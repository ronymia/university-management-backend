import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/semester-registrations', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL SEMESTER REGISTRATIONS
const getAllSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/semester-registrations', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/semester-registrations/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/semester-registrations/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/semester-registrations/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// ENROLL INTO SEMESTER REGISTRATION
const enrollIntoSemesterRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.post(
    `/semester-registrations/enrolled-into-semester`,
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

const enrolledIntoCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.post(`/semester-registrations/enrolled-into-course`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// WITHDRAW FROM ENROLLED COURSE
const withdrawFromEnrolledCourse = async (req: Request): Promise<any> => {
  const result = await HttpService.post(
    `/semester-registrations/withdraw-from-enrolled-course`,
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

// CONFIRM MY REGISTRATION
const confirmMyRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(
    `/semester-registrations/confirm-my-registration`,
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

// GET MY REGISTRATION
const getMyRegistration = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/semester-registrations/get-my-registration`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// START NEW SEMESTER
const startNewSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.post(
    `/semester-registrations/${req.params.id}/start-new-semester`,
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

// EXPORT SERVICES
export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  enrollIntoSemesterRegistration,
  enrolledIntoCourse,
  withdrawFromEnrolledCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester
};
