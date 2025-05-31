import express from 'express';
import { ManagementDepartmentControllers } from './managementDepartment.controller';

const router = express.Router();

router.route('/').get(ManagementDepartmentControllers.getAllManagementDepartments);
router.route('/:id').get(ManagementDepartmentControllers.getSingleManagementDepartment);

router.route('/').post(ManagementDepartmentControllers.createManagementDepartment);

router
  .route('/:id')
  .patch(ManagementDepartmentControllers.updateManagementDepartment)
  .delete(ManagementDepartmentControllers.deleteManagementDepartment);

// EXPORT ROUTERS
export const ManagementDepartmentRoutes = router;
