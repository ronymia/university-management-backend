import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

// GET ALL STUDENT
const getAllStudents = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/students`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET STUDENT BY ID
const getSingleStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.get(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE STUDENT
const updateStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.patch(`/students/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE STUDENT
const deleteStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await HttpService.delete(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent
};
