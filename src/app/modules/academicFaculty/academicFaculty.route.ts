import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router();

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);
router.get('/:id', AcademicFacultyControllers.getSingleAcademicFaculty);

router.post('/', AcademicFacultyControllers.createAcademicFaculty);

router
  .route('/:id')
  .patch(AcademicFacultyControllers.updateAcademicFaculty)
  .delete(AcademicFacultyControllers.deleteAcademicFaculty);

// EXPORT ROUTERS
export const AcademicFacultyRoutes = router;
