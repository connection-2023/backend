/*
  Warnings:

  - You are about to drop the column `description` on the `LectureCoupon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isStackable` to the `LectureCoupon` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `LecturerWebsiteUrl` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LectureCoupon" DROP COLUMN "description",
ADD COLUMN     "isStackable" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "LecturerWebsiteUrl" ALTER COLUMN "url" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LecturerProfileImageUrl" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "LecturerProfileImageUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "LecturerProfileImageUrl" ADD CONSTRAINT "LecturerProfileImageUrl_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
