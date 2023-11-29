import { ValidateResult } from './../../common/interface/common-interface';
import { CreateLectureCouponDto } from './../../coupon/dtos/create-lecture-coupon.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LectureReviewRepository } from '../repositories/lecture-review.repository';
import { ReadManyLectureQueryDto } from '../dtos/read-many-lecture-query.dto';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { ReadManyLectureReviewQueryDto } from '../dtos/read-many-lecture-review-query.dto';

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

    const readedReviews =
      await this.lectureReviewRespository.readManyLectureReviewByLectureWithUserId(
        lectureId,
        userId,
        order,
      );
    const reviews = [];

    for (const review of readedReviews) {
      const {
        _count,
        likedLectureReview,
        lecture,
        reservation,
        users,
        ...reviewObj
      } = review;
      const { userProfileImage, ...user } = users;

      user['profileImage'] = userProfileImage.imageUrl;

      reviewObj['user'] = user;
      reviewObj['lectureTitle'] = lecture.title;
      reviewObj['startDateTime'] = reservation.lectureSchedule.startDateTime;

      if (likedLectureReview[0]) {
        reviewObj['isLike'] = true;
      } else {
        reviewObj['isLike'] = false;
      }
      reviews.push(reviewObj);
      reviewObj['count'] = _count.likedLectureReview;
    }

    return reviews;
  }

  async readManyLectureReviewNonMember(lectureId: number, orderBy: string) {
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

    const readedReviews =
      await this.lectureReviewRespository.readManyLectureReviewByLecture(
        lectureId,
        order,
      );
    const reviews = [];

    for (const review of readedReviews) {
      const { _count, lecture, reservation, users, ...reviewObj } = review;
      const { userProfileImage, ...user } = users;

      user['profileImage'] = userProfileImage.imageUrl;

      reviewObj['user'] = user;
      reviewObj['lectureTitle'] = lecture.title;
      reviewObj['startDateTime'] = reservation.lectureSchedule.startDateTime;

      reviews.push(reviewObj);
      reviewObj['count'] = _count.likedLectureReview;
    }

    return reviews;
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

  async readManyMyReview(userId: number, query: ReadManyLectureReviewQueryDto) {
    const order = {};
    const { orderBy } = query;
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

    return await this.lectureReviewRespository.readManyMyReview(userId, order);
  }
}
