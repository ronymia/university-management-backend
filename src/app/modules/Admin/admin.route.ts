import express from 'express';
import { AdminControllers } from './admin.controller';

const router = express.Router();

// router.route('/').post(AdminControllers.createRoom);
router.route('/').get(AdminControllers.getAllAdmins);
router.route('/:id').get(AdminControllers.getSingleAdmin);

router.route('/:id').patch(AdminControllers.updateAdmin).delete(AdminControllers.deleteAdmin);

// EXPORT ROUTERS
export const AdminRoutes = router;
