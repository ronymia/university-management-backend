import { Request } from 'express';
import { AuthService } from '../../../shared/axios';

// GET ALL STUDENT
const getAllStudents = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/students`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET STUDENT BY ID
const getSingleStudent = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/students/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE STUDENT
const updateStudent = async (req: Request): Promise<any> => {
  const result = await AuthService.patch(`/students/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE STUDENT
const deleteStudent = async (req: Request): Promise<any> => {
  const result = await AuthService.delete(`/students/${req.params.id}`, {
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
