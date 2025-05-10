import { Request } from 'express';
import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

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

// EXPORT SERVICES
export const FacultyServices = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty
};
