import { PrismaService } from '@src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LectureLikeRepository } from '../repositories/lecture-like.repository';

@Injectable()
export class LectureLikeService {
  constructor(
    private readonly lectureLikeRepository: LectureLikeRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createLikeLecture(lectureId: number, userId: number): Promise<any> {
    const lectureLikeInputData = {
      lectureId,
      userId,
    };
    const createdLectureLike =
      await this.lectureLikeRepository.createLectureLike(lectureLikeInputData);

    return createdLectureLike;
  }

  async deleteLikeLecture(lectureId: number, userId: number): Promise<any> {
    return await this.prismaService.likedLecture.delete({
      where: { lectureId_userId: { lectureId, userId } },
    });
  }
}
