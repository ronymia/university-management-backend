/*
  Warnings:

  - You are about to drop the column `SemesterRegistrationId` on the `offered_course_sections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,offeredCourseId,semesterRegistrationId]` on the table `offered_course_sections` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,academicDepartmentId]` on the table `offered_courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterRegistrationId` to the `offered_course_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offered_course_sections" DROP CONSTRAINT "offered_course_sections_SemesterRegistrationId_fkey";

-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "SemesterRegistrationId",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "offered_course_sections_title_offeredCourseId_semesterRegis_key" ON "offered_course_sections"("title", "offeredCourseId", "semesterRegistrationId");

-- CreateIndex
CREATE UNIQUE INDEX "offered_courses_courseId_academicDepartmentId_key" ON "offered_courses"("courseId", "academicDepartmentId");

-- AddForeignKey
ALTER TABLE "offered_course_sections" ADD CONSTRAINT "offered_course_sections_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
