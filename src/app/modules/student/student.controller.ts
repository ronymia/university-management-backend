import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constant';
import { StudentService } from './student.service';

// get single semester
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudent(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully!',
    data: result,
  });
});

// get all semesters
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );

  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Student fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// // update single semester
// const updateStudent = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await StudentService.updateStudent(id, req.body);

//     sendResponse<IStudent>(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Student updated successfully!',
//         data: result,
//     });
// });

// // delete single semester
// const deleteStudent = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await StudentService.deleteStudent(id);

//     sendResponse<IStudent>(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Student Deleted successfully!',
//         data: result,
//     });
// });

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  // updateStudent,
  // deleteStudent,
};
