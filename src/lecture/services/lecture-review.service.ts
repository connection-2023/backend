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
import { ReadManyLecturerMyReviewQueryDto } from '../dtos/read-many-lecturer-my-review-query.dto';
import { ReadManyLecturerReviewQueryDto } from '../dtos/read-many-lecturer-review-query.dto';

@Injectable()
export class LectureReviewService {
  constructor(
    private readonly lectureReviewRepository: LectureReviewRepository,
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

        const lecture = await transaction.lecture.findFirst({
          where: { id: lectureId },
        });
        const prevReviewCount = lecture.reviewCount;
        const prevStars = lecture.stars;
        const nextReviewCount = prevReviewCount + 1;
        const nextStars =
          (prevStars * prevReviewCount + createLectureReviewDto.stars) /
          nextReviewCount;
        const roundStars = Math.round(nextStars * 100) / 100;

        const createdLectureReview =
          await this.lectureReviewRepository.trxCreateLectureReview(
            transaction,
            userId,
            createLectureReviewDto,
          );
        await this.lectureReviewRepository.trxIncreaseLectureReviewCount(
          transaction,
          lectureId,
        );
        await transaction.lecture.update({
          where: { id: lectureId },
          data: { stars: roundStars },
        });

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
      await this.lectureReviewRepository.readManyLectureReviewByLectureWithUserId(
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
      const { userProfileImage, phoneNumber, email, gender, name, ...user } =
        users;

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
      await this.lectureReviewRepository.readManyLectureReviewByLecture(
        lectureId,
        order,
      );
    const reviews = [];

    for (const review of readedReviews) {
      const { _count, lecture, reservation, users, ...reviewObj } = review;
      const { userProfileImage, phoneNumber, email, gender, name, ...user } =
        users;

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
    return await this.lectureReviewRepository.updateLectureReview(
      lectureReviewId,
      review,
    );
  }

  async deleteLectureReview(lectureReviewId: number) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lectureId =
          await this.lectureReviewRepository.trxGetLectureIdByReview(
            transaction,
            lectureReviewId,
          );
        const deletedLectureReview =
          await this.lectureReviewRepository.trxDeleteLectureReview(
            transaction,
            lectureReviewId,
          );

        await this.lectureReviewRepository.trxDecreaseLectureReviewCount(
          transaction,
          lectureId,
        );

        return deletedLectureReview;
      },
    );
  }

  async readManyMyReviewWithUserId(
    userId: number,
    query: ReadManyLectureReviewQueryDto,
  ) {
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

    return await this.lectureReviewRepository.readManyMyReviewWithUserId(
      userId,
      order,
    );
  }

  async readManyReservationThatCanBeCreated(userId: number) {
    return await this.lectureReviewRepository.readManyReservationThatCanBeCreated(
      userId,
    );
  }

  async readManyMyReviewWithLecturerId(
    lecturerId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      lecturerMyReviewType,
      orderBy,
      lectureId,
    }: ReadManyLecturerMyReviewQueryDto,
  ) {
    const existMyReviewWithLecturerId =
      await this.prismaService.lectureReview.findFirst({
        where: { lecture: { lecturerId } },
      });

    if (!existMyReviewWithLecturerId) {
      return;
    }

    let cursor;
    let skip;
    const where = { lecture: { lecturerId } };

    if (lecturerMyReviewType === '진행중인 클래스') {
      where.lecture['isActive'] = true;
    } else if (lecturerMyReviewType === '종료된 클래스') {
      where.lecture['isActive'] = false;
    }

    if (lectureId) {
      where['lectureId'] = lectureId;
    }

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

    const isPagination = currentPage && targetPage;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip, take } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));
    }

    return await this.lectureReviewRepository.readManyMyReviewWithLecturerId(
      where,
      order,
      take,
      cursor,
      skip,
    );
  }

  async readManyLecturerReviewWithUserId(
    lecturerId: number,
    userId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      lecturerReviewType,
    }: ReadManyLecturerReviewQueryDto,
  ) {
    const existReview = await this.prismaService.lectureReview.findFirst({
      where: { lecture: { lecturerId } },
    });

    if (!existReview) {
      return;
    }

    let cursor;
    let skip;
    const orderBy = {};

    if (lecturerReviewType === '최신순') {
      orderBy['reservation'] = {
        lectureSchedule: {
          startDateTime: 'desc',
        },
      };
    } else if (lecturerReviewType === '좋아요순') {
      orderBy['likedLectureReview'] = {
        _count: 'desc',
      };
    } else if (lecturerReviewType === '평점 높은순') {
      orderBy['stars'] = 'desc';
    } else if (lecturerReviewType === '평점 낮은순') {
      orderBy['stars'] = 'asc';
    }

    const isPagination = currentPage && targetPage;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip, take } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));
    }

    const review =
      await this.lectureReviewRepository.readManyLecturerReviewWithUserId(
        lecturerId,
        userId,
        take,
        orderBy,
        cursor,
        skip,
      );
    const count = await this.prismaService.lectureReview.count({
      where: { lecture: { lecturerId } },
    });

    return { count, review };
  }

  async readManyLecturerReview(
    lecturerId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      lecturerReviewType,
    }: ReadManyLecturerReviewQueryDto,
  ) {
    const existReview = await this.prismaService.lectureReview.findFirst({
      where: { lecture: { lecturerId } },
    });

    if (!existReview) {
      return;
    }

    let cursor;
    let skip;
    const orderBy = {};

    if (lecturerReviewType === '최신순') {
      orderBy['reservation'] = {
        lectureSchedule: {
          startDateTime: 'desc',
        },
      };
    } else if (lecturerReviewType === '좋아요순') {
      orderBy['likedLectureReview'] = {
        _count: 'desc',
      };
    } else if (lecturerReviewType === '평점 높은순') {
      orderBy['stars'] = 'desc';
    } else if (lecturerReviewType === '평점 낮은순') {
      orderBy['stars'] = 'asc';
    }

    const isPagination = currentPage && targetPage;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip, take } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));
    }

    const reviews = await this.lectureReviewRepository.readManyLecturerReview(
      lecturerId,
      take,
      orderBy,
      cursor,
      skip,
    );
    const count = await this.prismaService.lectureReview.count({
      where: { lecture: { lecturerId } },
    });

    return { count, reviews };
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor = { id: itemId };

    const calculateSkipValue = (pageDiff: number) => {
      return Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    };

    const skip = calculateSkipValue(pageDiff);

    return { cursor, skip, take: pageDiff >= 1 ? -take : take };
  }
}
