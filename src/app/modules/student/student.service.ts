import { Request } from 'express';
import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';
import { RedisClient } from '../../../shared/redis';

// GET ALL STUDENT
const getAllStudents = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.get(`/students`, {
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
  const result: IGenericResponse = await AuthService.get(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE STUDENT
const updateStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.patch(`/students/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE STUDENT
const deleteStudent = async (req: Request): Promise<IGenericResponse> => {
  const result: IGenericResponse = await AuthService.delete(`/students/${req.params.id}`, {
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
