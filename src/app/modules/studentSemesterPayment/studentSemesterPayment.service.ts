import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

const updateSemesterPayment = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/student-semester-payments/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getAllStudentSemesterPayments = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-semester-payments`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getSingleStudentSemesterPayment = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/student-semester-payments/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const deleteStudentSemesterPayment = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/student-semester-payments/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

export const StudentSemesterPaymentServices = {
  updateSemesterPayment,
  getAllStudentSemesterPayments,
  getSingleStudentSemesterPayment,
  deleteStudentSemesterPayment
};
