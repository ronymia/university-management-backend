import express from 'express';
import { AdminController } from './admin.controller';
const router = express.Router();

router.get('/:id', AdminController.getSingleAdmin);
router.get('/', AdminController.getAllAdmins);

// router.delete('/:id', AdminController.deleteAdmin);

// router.patch(
//     '/:id',
//     validateRequest(AdminValidation.updateAdmin),
//     AdminController.updateAdmin,
// );

export const AdminRoutes = router;
