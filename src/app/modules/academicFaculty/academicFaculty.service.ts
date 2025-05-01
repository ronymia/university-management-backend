import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

const createAcademicFaculty = async (req: Request) => {
  const result = await HttpService.post('/academic-faculties', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL FACULTY
const getAllAcademicFaculties = async (req: Request) => {
  const result = await HttpService.get('/academic-faculties', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET SINGLE FACULTY
const getSingleAcademicFaculty = async (req: Request) => {
  const result = await HttpService.get(`/academic-faculties/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.Authorization
    }
  });
  return result;
};

// EXPORT DEFAULT
export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty
};
