import express from 'express';
// import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
// import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get(
  '/:id',
  // auth(
  //     ENUM_USER_ROLE.SUPER_ADMIN,
  //     ENUM_USER_ROLE.ADMIN,
  //     ENUM_USER_ROLE.FACULTY,
  //     ENUM_USER_ROLE.STUDENT,
  // ),
  FacultyController.getSingleFaculty
);
// router.patch(
//     '/:id',
//     validateRequest(FacultyValidation.updateFacultyZodSchema),
//     auth(
//         ENUM_USER_ROLE.SUPER_ADMIN,
//         ENUM_USER_ROLE.ADMIN,
//         ENUM_USER_ROLE.FACULTY,
//     ),
//     FacultyController.updateFaculty,
// );
// router.delete(
//     '/:id',
//     auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//     FacultyController.deleteFaculty,
// );

router.get(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.getAllFaculties
);

export const FacultyRoutes = router;
