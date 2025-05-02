import express from 'express';
import { BuildingControllers } from './building.controller';

const router = express.Router();

router.route('/').get(BuildingControllers.getAllBuildings);
router.route('/:id').get(BuildingControllers.getSingleBuilding);

router
  .route('/:id')
  .patch(BuildingControllers.updateBuilding)
  .delete(BuildingControllers.deleteBuilding);

// EXPORT ROUTERS
export const BuildingRoutes = router;
