-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "isProfileOpen" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" VARCHAR(11),
    "detailAddress" VARCHAR(255),
    "gender" SMALLINT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileImage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "UserProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "administrativeDistrict" VARCHAR(19) NOT NULL,
    "district" VARCHAR(10),

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecturer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "siteUrl" VARCHAR(255) NOT NULL,
    "workTime" VARCHAR(11) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Lecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" SERIAL NOT NULL,
    "danceLecturerId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "lectureTypeId" INTEGER NOT NULL,
    "danceCategoryId" INTEGER NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "detailAddress" VARCHAR(30) NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficultyLevel" VARCHAR(5) NOT NULL,
    "minCapacity" INTEGER NOT NULL,
    "maxCapacity" INTEGER,
    "isGroup" BOOLEAN NOT NULL,
    "reservationDeadline" DATE NOT NULL,
    "reservationComment" VARCHAR(255),
    "price" INTEGER NOT NULL,
    "noShowDeposit" INTEGER,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureGroup" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "groupMinCapacity" INTEGER NOT NULL,
    "groupMaxCapacity" INTEGER NOT NULL,

    CONSTRAINT "LectureGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DanceCategory" (
    "id" SERIAL NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "DanceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LectureType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureReview" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "LectureReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LecturerReview" (
    "id" SERIAL NOT NULL,
    "lecturerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "LecturerReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_nickname_key" ON "Users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "Users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileImage_userId_key" ON "UserProfileImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_userId_key" ON "Lecturer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_title_key" ON "Lecture"("title");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileImage" ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_danceLecturerId_fkey" FOREIGN KEY ("danceLecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_lectureTypeId_fkey" FOREIGN KEY ("lectureTypeId") REFERENCES "LectureType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_danceCategoryId_fkey" FOREIGN KEY ("danceCategoryId") REFERENCES "DanceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureGroup" ADD CONSTRAINT "LectureGroup_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureReview" ADD CONSTRAINT "LectureReview_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureReview" ADD CONSTRAINT "LectureReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerReview" ADD CONSTRAINT "LecturerReview_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LecturerReview" ADD CONSTRAINT "LecturerReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
