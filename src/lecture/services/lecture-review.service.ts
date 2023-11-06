import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LectureReviewRepository } from '../repositories/lecture-review.repository';
import { LectureReview } from '@prisma/client';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';

@Injectable()
export class LectureReviewService {
  constructor(
    private readonly lectureReviewRespository: LectureReviewRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async readManyLectureReview(lectureId: number, orderBy: string) {
    const order = {};

    if (orderBy === '최신순') {
      order['reservation'] = {
        lectureSchedule: {
          startDateTime: 'desc',
        },
      };
    } else if (orderBy === '좋아요순') {
      order['likedLectureReview'] = {
        _count: 'desc',
      };
    } else if (orderBy === '평점 높은순') {
      order['stars'] = 'desc';
    } else if (orderBy === '평점 낮은순') {
      order['stars'] = 'asc';
    }

    try {
      return this.lectureReviewRespository.readManyLectureReviewByLecture(
        lectureId,
        order,
      );
    } catch (error) {
      throw new error();
    }
  }
}
