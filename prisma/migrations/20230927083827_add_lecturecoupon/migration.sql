-- CreateTable
CREATE TABLE "DailySmsUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dailySentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailySmsUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedLecture" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LikedLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureCoupon" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "percentage" INTEGER,
    "discountPrice" INTEGER,
    "maxDiscountPrice" INTEGER,
    "maxUsageCount" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "startAt" TIMESTAMP(6) NOT NULL,
    "endAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "LectureCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureCouponTarget" (
    "id" SERIAL NOT NULL,
    "lectureCouponId" INTEGER NOT NULL,
    "lectureId" INTEGER NOT NULL,

    CONSTRAINT "LectureCouponTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCoupon" (
    "id" SERIAL NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lectureCouponId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailySmsUsage_userId_key" ON "DailySmsUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LikedLecture_lectureId_userId_key" ON "LikedLecture"("lectureId", "userId");

-- AddForeignKey
ALTER TABLE "DailySmsUsage" ADD CONSTRAINT "DailySmsUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedLecture" ADD CONSTRAINT "LikedLecture_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedLecture" ADD CONSTRAINT "LikedLecture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureCoupon" ADD CONSTRAINT "LectureCoupon_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureCouponTarget" ADD CONSTRAINT "LectureCouponTarget_lectureCouponId_fkey" FOREIGN KEY ("lectureCouponId") REFERENCES "LectureCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureCouponTarget" ADD CONSTRAINT "LectureCouponTarget_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_lectureCouponId_fkey" FOREIGN KEY ("lectureCouponId") REFERENCES "LectureCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
