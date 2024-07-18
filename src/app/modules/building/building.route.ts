import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validation';
const router = express.Router();

router.post(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidation.createBuildingZodSchema),
  BuildingController.createBuilding
);

router.get('/:id', BuildingController.getSingleBuilding);
router.get('/', BuildingController.getAllBuildings);

router.patch(
  '/:id',
  validateRequest(BuildingValidation.updateBuildingZodSchema),
  BuildingController.updateBuilding
);
router.delete('/:id', BuildingController.deleteBuilding);

export const BuildingRoutes = router;
