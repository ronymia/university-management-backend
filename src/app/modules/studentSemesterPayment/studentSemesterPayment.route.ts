import express from 'express';
import auth from '../../middlewares/auth';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// GET ALL SEMESTER PAYMENT
router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentSemesterPaymentController.getAllSemesterPayment
  );
router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentSemesterPaymentController.getSingleSemesterPayment
  );

router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentSemesterPaymentController.updatedSemesterPayment
  );
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentSemesterPaymentController.deleteSemesterPayment
  );

// EXPORT
export const StudentSemesterPaymentRoutes = router;
