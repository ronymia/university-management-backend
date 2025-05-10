import express, { NextFunction, Request, Response } from 'express';

import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { UserValidation } from './user.validation';

const router = express.Router();

// CREATE STUDENT
router.route('/create-student').post(
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  //   UserControllers.createStudent
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createStudentZodSchema.parse(JSON.parse(req.body.data));
    return UserControllers.createStudent(req, res, next);
  }
);

// CREATE ADMIN
router.route('/create-admin').post(
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // UserControllers.createAdmin
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminZodSchema.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res, next);
  }
);

// CREATE FACULTY
router.route('/create-faculty').post(
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // UserControllers.createFaculty
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createFacultyZodSchema.parse(JSON.parse(req.body.data));
    return UserControllers.createFaculty(req, res, next);
  }
);

// EXPORT ROUTERS
export const UserRoutes = router;
