/*
  Warnings:

  - The values [QUIZ,ASSIGNMENT,PROJECT] on the enum `ExamType` will be removed. If these variants are still used in the database, this will fail.
  - The values [WITHDRAWN] on the enum `StudentEnrolledCourseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academicSemesterId` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `faculties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `academic_semesters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `buildings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNumber]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicFacultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExamType_new" AS ENUM ('MIDTERM', 'FINAL');
ALTER TABLE "student_enrolled_course_marks" ALTER COLUMN "examType" DROP DEFAULT;
ALTER TABLE "student_enrolled_course_marks" ALTER COLUMN "examType" TYPE "ExamType_new" USING ("examType"::text::"ExamType_new");
ALTER TYPE "ExamType" RENAME TO "ExamType_old";
ALTER TYPE "ExamType_new" RENAME TO "ExamType";
DROP TYPE "ExamType_old";
ALTER TABLE "student_enrolled_course_marks" ALTER COLUMN "examType" SET DEFAULT 'MIDTERM';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StudentEnrolledCourseStatus_new" AS ENUM ('ONGOING', 'ENROLLED', 'DROPPED', 'COMPLETED');
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" TYPE "StudentEnrolledCourseStatus_new" USING ("status"::text::"StudentEnrolledCourseStatus_new");
ALTER TYPE "StudentEnrolledCourseStatus" RENAME TO "StudentEnrolledCourseStatus_old";
ALTER TYPE "StudentEnrolledCourseStatus_new" RENAME TO "StudentEnrolledCourseStatus";
DROP TYPE "StudentEnrolledCourseStatus_old";
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" SET DEFAULT 'ONGOING';
COMMIT;

-- DropForeignKey
ALTER TABLE "faculties" DROP CONSTRAINT "faculties_academicSemesterId_fkey";

-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "academicSemesterId",
DROP COLUMN "profileImage",
ADD COLUMN     "academicFacultyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "academic_semesters_title_key" ON "academic_semesters"("title");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_title_key" ON "buildings"("title");

-- CreateIndex
CREATE UNIQUE INDEX "courses_title_key" ON "courses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNumber_key" ON "rooms"("roomNumber");

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
