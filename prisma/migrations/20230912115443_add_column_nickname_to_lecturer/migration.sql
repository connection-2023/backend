/*
  Warnings:

  - Added the required column `lectureMethodId` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Lecturer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "lectureMethodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lecturer" ADD COLUMN     "nickname" VARCHAR(11) NOT NULL;

-- CreateTable
CREATE TABLE "LectureMethod" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "LectureMethod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_lectureMethodId_fkey" FOREIGN KEY ("lectureMethodId") REFERENCES "LectureMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
