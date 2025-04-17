import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OfferedCourseSectionControllers } from './offeredCourseSection.controller';
const router = express.Router();

router.route('/').post(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(OfferedCourseValidation.createOfferedCourseZodSchema),
  OfferedCourseSectionControllers.createOfferedCourseSection
);

router
  .route('/:id')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY,
      ENUM_USER_ROLE.STUDENT
    ),
    OfferedCourseSectionControllers.getSingleOfferedCourseSection
  );

router
  .route('/')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY,
      ENUM_USER_ROLE.STUDENT
    ),
    OfferedCourseSectionControllers.getAllOfferedCourseSections
  );

router.route('/:id').patch(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(OfferedCourseValidation.updateOfferedCourseZodSchema),
  OfferedCourseSectionControllers.updateOfferedCourseSection
);

router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseSectionControllers.deleteOfferedCourseSection
  );

//   EXPORT
export const OfferedCourseSectionRoutes = router;
