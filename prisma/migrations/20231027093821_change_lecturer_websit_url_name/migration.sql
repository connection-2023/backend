/*
  Warnings:

  - You are about to drop the column `danceCategoryId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `danceLecturerId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `isGroup` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `UserProfileImage` table. All the data in the column will be lost.
  - You are about to drop the column `detailAddress` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `LectureGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LecturerWebsiteUrl` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `curriculum` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturerId` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxCapacity` on table `Lecture` required. This step will fail if there are existing NULL values in that column.
  - The required column `uuid` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Auth" DROP CONSTRAINT "Auth_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_danceCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_danceLecturerId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_regionId_fkey";

-- DropForeignKey
ALTER TABLE "LectureGroup" DROP CONSTRAINT "LectureGroup_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "LecturerWebsiteUrl" DROP CONSTRAINT "LecturerWebsiteUrl_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileImage" DROP CONSTRAINT "UserProfileImage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_regionId_fkey";

-- DropIndex
DROP INDEX "Lecture_title_key";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "danceCategoryId",
DROP COLUMN "danceLecturerId",
DROP COLUMN "isGroup",
DROP COLUMN "regionId",
ADD COLUMN     "curriculum" TEXT NOT NULL,
ADD COLUMN     "introduction" VARCHAR(500),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lecturerId" INTEGER NOT NULL,
ALTER COLUMN "detailAddress" DROP NOT NULL,
ALTER COLUMN "maxCapacity" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lecturer" ADD COLUMN     "profileCardImageUrl" TEXT,
ALTER COLUMN "experience" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProfileImage" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" VARCHAR(255);

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "detailAddress",
DROP COLUMN "regionId",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- DropTable
DROP TABLE "LectureGroup";

-- DropTable
DROP TABLE "LecturerWebsiteUrl";

-- CreateTable
CREATE TABLE "LectureNotification" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "notification" VARCHAR(200) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LectureNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureImage" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "LectureImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturerInstagramPostUrl" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "LecturerInstagramPostUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureSchedule" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,
    "team" TEXT,

    CONSTRAINT "LectureSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureToRegion" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "lectureId" INTEGER NOT NULL,

    CONSTRAINT "LectureToRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureToDanceGenre" (
    "id" SERIAL NOT NULL,
    "danceCategoryId" INTEGER NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "LectureToDanceGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureHoliday" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "holiday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LectureHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLecture" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "step" INTEGER,
    "lectureTypeId" INTEGER,
    "lectureMethodId" INTEGER,
    "title" VARCHAR(30),
    "introduction" VARCHAR(500),
    "curriculum" TEXT,
    "detailAddress" VARCHAR(30),
    "duration" INTEGER,
    "difficultyLevel" VARCHAR(5),
    "minCapacity" INTEGER,
    "maxCapacity" INTEGER,
    "reservationDeadline" DATE,
    "reservationComment" VARCHAR(255),
    "price" INTEGER,
    "noShowDeposit" INTEGER,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "TemporaryLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureSchedule" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "numberOfParticipants" INTEGER,
    "team" TEXT,

    CONSTRAINT "TemporaryLectureSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureToRegion" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER,
    "lectureId" INTEGER NOT NULL,

    CONSTRAINT "TemporaryLectureToRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureToDanceGenre" (
    "id" SERIAL NOT NULL,
    "danceCategoryId" INTEGER,
    "lectureId" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "TemporaryLectureToDanceGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureHoliday" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "holiday" TIMESTAMP(3),

    CONSTRAINT "TemporaryLectureHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureCouponTarget" (
    "id" SERIAL NOT NULL,
    "lectureCouponId" INTEGER,
    "lectureId" INTEGER NOT NULL,

    CONSTRAINT "TemporaryLectureCouponTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureNotification" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "notification" VARCHAR(200),
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "TemporaryLectureNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryLectureImage" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "TemporaryLectureImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LectureNotification_lectureId_key" ON "LectureNotification"("lectureId");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryLectureNotification_lectureId_key" ON "TemporaryLectureNotification"("lectureId");

-- AddForeignKey
ALTER TABLE "UserProfileImage" ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureNotification" ADD CONSTRAINT "LectureNotification_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureImage" ADD CONSTRAINT "LectureImage_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerInstagramPostUrl" ADD CONSTRAINT "LecturerInstagramPostUrl_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureSchedule" ADD CONSTRAINT "LectureSchedule_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureToRegion" ADD CONSTRAINT "LectureToRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureToRegion" ADD CONSTRAINT "LectureToRegion_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureToDanceGenre" ADD CONSTRAINT "LectureToDanceGenre_danceCategoryId_fkey" FOREIGN KEY ("danceCategoryId") REFERENCES "DanceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureToDanceGenre" ADD CONSTRAINT "LectureToDanceGenre_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureHoliday" ADD CONSTRAINT "LectureHoliday_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLecture" ADD CONSTRAINT "TemporaryLecture_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLecture" ADD CONSTRAINT "TemporaryLecture_lectureTypeId_fkey" FOREIGN KEY ("lectureTypeId") REFERENCES "LectureType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLecture" ADD CONSTRAINT "TemporaryLecture_lectureMethodId_fkey" FOREIGN KEY ("lectureMethodId") REFERENCES "LectureMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureSchedule" ADD CONSTRAINT "TemporaryLectureSchedule_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureToRegion" ADD CONSTRAINT "TemporaryLectureToRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureToRegion" ADD CONSTRAINT "TemporaryLectureToRegion_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureToDanceGenre" ADD CONSTRAINT "TemporaryLectureToDanceGenre_danceCategoryId_fkey" FOREIGN KEY ("danceCategoryId") REFERENCES "DanceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureToDanceGenre" ADD CONSTRAINT "TemporaryLectureToDanceGenre_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureHoliday" ADD CONSTRAINT "TemporaryLectureHoliday_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureCouponTarget" ADD CONSTRAINT "TemporaryLectureCouponTarget_lectureCouponId_fkey" FOREIGN KEY ("lectureCouponId") REFERENCES "LectureCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureCouponTarget" ADD CONSTRAINT "TemporaryLectureCouponTarget_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureNotification" ADD CONSTRAINT "TemporaryLectureNotification_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryLectureImage" ADD CONSTRAINT "TemporaryLectureImage_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "TemporaryLecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
