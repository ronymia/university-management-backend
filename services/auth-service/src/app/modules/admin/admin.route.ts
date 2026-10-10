import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.get(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AdminController.getSingleAdmin,
);
router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.getAllAdmins);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    AdminController.deleteAdmin,
);

router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequest(AdminValidation.updateAdmin),
    AdminController.updateAdmin,
);

export const AdminRoutes = router;
