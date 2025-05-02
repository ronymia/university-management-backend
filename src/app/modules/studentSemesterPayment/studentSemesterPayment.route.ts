import express from 'express';
import { StudentSemesterPaymentControllers } from './studentSemesterPayment.controller';

const router = express.Router();

router.route('/').get(StudentSemesterPaymentControllers.getAllStudentSemesterPayments);
router.route('/:id').get(StudentSemesterPaymentControllers.getSingleStudentSemesterPayment);

router
  .route('/:id')
  .patch(StudentSemesterPaymentControllers.updateSemesterPayment)
  .delete(StudentSemesterPaymentControllers.deleteStudentSemesterPayment);

// EXPORT ROUTERS
export const StudentSemesterPaymentRoutes = router;
