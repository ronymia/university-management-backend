import { Building } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

const createBuilding = (payload: Building): Promise<Building> => {
  const result = prisma.building.create({
    data: payload,
  });

  return result;
};

export const BuildingService = {
  createBuilding,
};
