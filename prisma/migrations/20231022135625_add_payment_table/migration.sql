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
  - Added the required column `curriculum` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introduction` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturerId` to the `Lecture` table without a default value. This is not possible if the table is not empty.

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
ADD COLUMN     "introduction" VARCHAR(500) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lecturerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lecturer" ALTER COLUMN "experience" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProfileImage" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" VARCHAR(255);

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "detailAddress",
DROP COLUMN "regionId";

-- DropTable
DROP TABLE "LectureGroup";

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
CREATE TABLE "LectureCurriculumImage" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "LectureCurriculumImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureImage" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "LectureImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureSchedule" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "numberOfParticipants" INTEGER NOT NULL,

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
CREATE TABLE "LecturePayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderName" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LecturePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentCouponUsage" (
    "id" SERIAL NOT NULL,
    "couponId" INTEGER,
    "couponPercentage" INTEGER,
    "couponDiscountPrice" INTEGER,
    "couponMaxDiscountPrice" INTEGER,
    "stackableCouponId" INTEGER,
    "stackableCouponPercentage" INTEGER,
    "stackableCouponDiscountPrice" INTEGER,
    "stackableCouponMaxDiscountPrice" INTEGER,

    CONSTRAINT "PaymentCouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lectureScheduleId" INTEGER NOT NULL,
    "representative" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "participants" INTEGER NOT NULL,
    "requests" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LecturePayment_id_key" ON "LecturePayment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LecturePayment_orderId_key" ON "LecturePayment"("orderId");

-- AddForeignKey
ALTER TABLE "UserProfileImage" ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureNotification" ADD CONSTRAINT "LectureNotification_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureCurriculumImage" ADD CONSTRAINT "LectureCurriculumImage_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureImage" ADD CONSTRAINT "LectureImage_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "LecturePayment" ADD CONSTRAINT "LecturePayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturePayment" ADD CONSTRAINT "LecturePayment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PaymentStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturePayment" ADD CONSTRAINT "LecturePayment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturePayment" ADD CONSTRAINT "LecturePayment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCouponUsage" ADD CONSTRAINT "PaymentCouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "LectureCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCouponUsage" ADD CONSTRAINT "PaymentCouponUsage_stackableCouponId_fkey" FOREIGN KEY ("stackableCouponId") REFERENCES "LectureCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_lectureScheduleId_fkey" FOREIGN KEY ("lectureScheduleId") REFERENCES "LectureSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
