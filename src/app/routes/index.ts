import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { BuildingRoutes } from '../modules/building/building.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { RoomRoutes } from '../modules/room/room.route';
import { StudentRoutes } from '../modules/student/student.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-faculties/',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments/',
    route: AcademicDepartmentRoutes,
  },
  // {
  //   path: '/management-departments/',
  //   route: ManagementDepartmentRoutes,
  // },
  {
    path: '/students/',
    route: StudentRoutes,
  },
  {
    path: '/faculties/',
    route: FacultyRoutes,
  },
  {
    path: '/admins/',
    route: AdminRoutes,
  },
  {
    path: '/buildings/',
    route: BuildingRoutes,
  },
  {
    path: '/rooms/',
    route: RoomRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));
export default router;
