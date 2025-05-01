import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE ACADEMIC FACULTY
const createAcademicFaculty = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/academic-faculties', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL ACADEMIC FACULTY
const getAllAcademicFaculties = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/academic-faculties', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET SINGLE ACADEMIC FACULTY
const getSingleAcademicFaculty = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/academic-faculties/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.Authorization
    }
  });
  return result;
};

// UPDATE ACADEMIC FACULTY
const updateAcademicFaculty = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/academic-faculties/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// DELETE ACADEMIC FACULTY
const deleteAcademicFaculty = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/academic-faculties/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT DEFAULT
export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty
};
