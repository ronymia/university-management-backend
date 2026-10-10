/*
  Warnings:

  - You are about to drop the column `isConfirm` on the `student_semester_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_semester_registrations" DROP COLUMN "isConfirm",
ADD COLUMN     "isConfirmed" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "middleName" DROP NOT NULL;
