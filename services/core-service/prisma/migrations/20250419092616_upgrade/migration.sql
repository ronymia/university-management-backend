/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `offered_course_sections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "offered_course_sections_title_key" ON "offered_course_sections"("title");
