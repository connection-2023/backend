import { ValidateResult } from './../../common/interface/common-interface';
import { CreateLectureCouponDto } from './../../coupon/dtos/create-lecture-coupon.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LectureReviewRepository } from '../repositories/lecture-review.repository';
import { LectureReview } from '@prisma/client';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class LectureReviewService {
  constructor(
    private readonly lectureReviewRespository: LectureReviewRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createLectureReview(
    userId: number,
    createLectureReviewDto: CreateLectureReviewDto,
  ) {
    const { lectureId } = createLectureReviewDto;
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const existLectureReview =
          await this.prismaService.lectureReview.findUnique({
            where: { reservationId: createLectureReviewDto.reservationId },
          });

        if (existLectureReview) {
          throw new BadRequestException('Exist Lecture Review');
        }

        const createdLectureReview =
          await this.lectureReviewRespository.trxCreateLectureReview(
            transaction,
            userId,
            createLectureReviewDto,
          );
        await this.lectureReviewRespository.trxIncreaseLectureReviewCount(
          transaction,
          lectureId,
        );

        return createdLectureReview;
      },
    );
  }

  async readManyLectureReviewWithUserId(
    userId: number,
    lectureId: number,
    orderBy: string,
  ) {
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

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const reviews =
          await this.lectureReviewRespository.trxReadManyLectureReviewByLectureWithUserId(
            transaction,
            lectureId,
            userId,
            order,
          );
        return reviews;
      },
    );
  }

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

    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const reviews =
          await this.lectureReviewRespository.trxReadManyLectureReviewByLecture(
            transaction,
            lectureId,
            order,
          );
        return reviews;
      },
    );
  }

  async updateLectureReview(
    lectureReviewId: number,
    review: UpdateLectureReviewDto,
  ) {
    return await this.lectureReviewRespository.updateLectureReview(
      lectureReviewId,
      review,
    );
  }

  async deleteLectureReview(lectureReviewId: number) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lectureId =
          await this.lectureReviewRespository.trxGetLectureIdByReview(
            transaction,
            lectureReviewId,
          );
        const deletedLectureReview =
          await this.lectureReviewRespository.trxDeleteLectureReview(
            transaction,
            lectureReviewId,
          );

        await this.lectureReviewRespository.trxDecreaseLectureReviewCount(
          transaction,
          lectureId,
        );

        return deletedLectureReview;
      },
    );
  }
}
