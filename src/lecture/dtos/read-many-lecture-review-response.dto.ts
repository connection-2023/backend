import { LikedLectureReview, Users } from '@prisma/client';

export class LectureReviewResponseDto {
  lectureId: number;
  userId: number;
  reservationId: number;
  stars: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  users: Users & { userProfileImage: { imageUrl: string } };
  reservation: { lectureSchedule: { startDateTime: Date } };
  likedLectureReview: LikedLectureReview[];
  _count: { likedLectureReview: number };
  lecture: { title: string };
}
