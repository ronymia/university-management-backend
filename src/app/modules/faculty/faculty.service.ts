import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// GET ALL FACULTY
const getAllFaculties = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/faculties`, {
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
  const result: IGenericResponse = await HttpService.get(`/faculties/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE FACULTY
const updateFaculty = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.patch(
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
  const result: IGenericResponse = await HttpService.delete(`/faculties/${req.params.id}`, {
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
