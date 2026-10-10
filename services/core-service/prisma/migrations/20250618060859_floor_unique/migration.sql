/*
  Warnings:

  - A unique constraint covering the columns `[roomNumber,floor]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rooms_roomNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNumber_floor_key" ON "rooms"("roomNumber", "floor");
