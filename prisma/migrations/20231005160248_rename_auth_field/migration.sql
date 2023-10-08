/*
  Warnings:

  - You are about to drop the column `signInType` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `signUpType` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "signInType",
ADD COLUMN     "signUpType" INTEGER NOT NULL;
