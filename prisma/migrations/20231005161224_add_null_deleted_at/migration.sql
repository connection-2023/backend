-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserCoupon" ALTER COLUMN "deletedAt" DROP NOT NULL;
