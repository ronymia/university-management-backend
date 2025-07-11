import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ManagementDepartmentController } from './managementDepartment.controller';
import { ManagementDepartmentValidation } from './managementDepartment.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequest(
        ManagementDepartmentValidation.createManagementDepartmentZodSchema,
    ),
    ManagementDepartmentController.createManagementDepartment,
);

router.get(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    ManagementDepartmentController.getAllManagementDepartments,
);

router.get(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    ManagementDepartmentController.getSingleManagementDepartment,
);

router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    ManagementDepartmentController.updateManagementDepartment,
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    ManagementDepartmentController.deleteManagementDepartment,
);

export const ManagementDepartmentRoutes = router;
