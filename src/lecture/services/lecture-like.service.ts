import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LectureLikeRepository } from '../repositories/lecture-like.repository';
import { LectureDto } from '@src/common/dtos/lecture.dto';

@Injectable()
export class LectureLikeService {
  constructor(
    private readonly lectureLikeRepository: LectureLikeRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createLikeLecture(lectureId: number, userId: number) {
    const lectureLikeInputData = {
      lectureId,
      userId,
    };
    const createdLectureLike =
      await this.lectureLikeRepository.createLectureLike(lectureLikeInputData);

    return createdLectureLike;
  }

  async deleteLikeLecture(lectureId: number, userId: number): Promise<void> {
    await this.prismaService.likedLecture.delete({
      where: { lectureId_userId: { lectureId, userId } },
    });
  }

  async getLikedLecture(userId: number) {
    const likedLectures =
      await this.lectureLikeRepository.getLikedLectureWithUserId(userId);
    const totalItemCount =
      await this.lectureLikeRepository.countLikedLectureWithUserId(userId);
    const serializedLikedLectures = likedLectures.map((likedLecture) => {
      const serializedLikedLecture = new LectureDto(likedLecture['lecture']);

      serializedLikedLecture.isLike = true;

      return serializedLikedLecture;
    });

    return { totalItemCount, likedLectures: serializedLikedLectures };
  }
}
