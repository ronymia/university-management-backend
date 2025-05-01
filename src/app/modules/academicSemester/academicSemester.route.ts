import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:id', AcademicSemesterControllers.getSingleAcademicSemester);

router.post('/', AcademicSemesterControllers.createAcademicSemester);

router
  .route('/:id')
  .patch(AcademicSemesterControllers.updateAcademicSemester)
  .delete(AcademicSemesterControllers.deleteAcademicSemester);

// EXPORT ROUTERS
export const AcademicSemesterRoutes = router;
