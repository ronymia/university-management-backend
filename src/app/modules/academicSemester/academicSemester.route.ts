import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:id', AcademicSemesterControllers.getSingleAcademicSemester);

router.post('/', AcademicSemesterControllers.createAcademicSemester);

// EXPORT ROUTERS
export const AcademicSemesterRoutes = router;
