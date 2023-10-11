/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `Lecturer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_nickname_key" ON "Lecturer"("nickname");
