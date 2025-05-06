import express, { NextFunction, Request, Response } from 'express';

import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { UserValidation } from './user.validation';

const router = express.Router();

router.route('/create-student').post(
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  //   UserControllers.createStudent
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createStudentZodSchema.parse(JSON.parse(req.body.data));
    return UserControllers.createStudent(req, res, next);
  }
);

// EXPORT ROUTERS
export const UserRoutes = router;
