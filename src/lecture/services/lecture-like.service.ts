import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureLikeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLikeLecture(lectureId: number, userId: number): Promise<any> {
    return await this.prismaService.likedLecture.create({
      data: { lectureId, userId },
    });
  }
}
