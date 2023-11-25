import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LectureLikeRepository } from '../repositories/lecture-like.repository';

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

  async readManyLikedLecture(userId: number, isActive: boolean) {
    return await this.lectureLikeRepository.readManyLikedLectureWithUserId(
      userId,
      isActive,
    );
  }
}
