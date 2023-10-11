/*
  Warnings:

  - Added the required column `email` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Lecturer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecturer" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
