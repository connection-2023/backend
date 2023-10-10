/*
  Warnings:

  - You are about to drop the column `description` on the `Lecturer` table. All the data in the column will be lost.
  - You are about to drop the column `siteUrl` on the `Lecturer` table. All the data in the column will be lost.
  - You are about to drop the column `workTime` on the `Lecturer` table. All the data in the column will be lost.
  - Added the required column `affiliation` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homepageUrl` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagramUrl` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introduction` to the `Lecturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtubeUrl` to the `Lecturer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecturer" DROP COLUMN "description",
DROP COLUMN "siteUrl",
DROP COLUMN "workTime",
ADD COLUMN     "affiliation" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "homepageUrl" TEXT NOT NULL,
ADD COLUMN     "instagramUrl" TEXT NOT NULL,
ADD COLUMN     "introduction" TEXT NOT NULL,
ADD COLUMN     "youtubeUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LecturerRegion" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,

    CONSTRAINT "LecturerRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturerDanceGenre" (
    "id" SERIAL NOT NULL,
    "danceCategoryId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "LecturerDanceGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturerWebsiteUrl" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "LecturerWebsiteUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LecturerRegion" ADD CONSTRAINT "LecturerRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerRegion" ADD CONSTRAINT "LecturerRegion_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerDanceGenre" ADD CONSTRAINT "LecturerDanceGenre_danceCategoryId_fkey" FOREIGN KEY ("danceCategoryId") REFERENCES "DanceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerDanceGenre" ADD CONSTRAINT "LecturerDanceGenre_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerWebsiteUrl" ADD CONSTRAINT "LecturerWebsiteUrl_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
