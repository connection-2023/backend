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
        const createdLectureReview =
          await this.lectureReviewRepository.trxCreateLectureReview(
            transaction,
            userId,
            createLectureReviewDto,
          );

        await this.increaseLectureStars(
          transaction,
          lectureId,
          createLectureReviewDto.stars,
        );
        await this.increaseLecturerStars(
          transaction,
          lecture.lecturerId,
          createLectureReviewDto.stars,
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
    const order = [];

    order.push({ id: 'desc' });

    if (orderBy === '최신순') {
      order.push({
        reservation: {
          lectureSchedule: {
            startDateTime: 'desc',
          },
        },
      });
    } else if (orderBy === '좋아요순') {
      order.push({
        likedLectureReview: {
          _count: 'desc',
        },
      });
    } else if (orderBy === '평점 높은순') {
      order.push({ stars: 'desc' });
    } else if (orderBy === '평점 낮은순') {
      order.push({ stars: 'asc' });
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
    const order = [];

    order.push({ id: 'desc' });

    if (orderBy === '최신순') {
      order.push({
        reservation: {
          lectureSchedule: {
            startDateTime: 'desc',
          },
        },
      });
    } else if (orderBy === '좋아요순') {
      order.push({
        likedLectureReview: {
          _count: 'desc',
        },
      });
    } else if (orderBy === '평점 높은순') {
      order.push({ stars: 'desc' });
    } else if (orderBy === '평점 낮은순') {
      order.push({ stars: 'asc' });
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
        const lecture = await this.prismaService.lecture.findFirst({
          where: { id: lectureId },
        });
        const lectureReview = await transaction.lectureReview.findFirst({
          where: { id: lectureReviewId },
        });

        const deletedLectureReview =
          await this.lectureReviewRepository.trxDeleteLectureReview(
            transaction,
            lectureReviewId,
          );

        await this.decreaseLectureStars(
          transaction,
          lectureId,
          lectureReview.stars,
        );
        await this.decreaseLecturerStars(
          transaction,
          lecture.lecturerId,
          lectureReview.stars,
        );

        return deletedLectureReview;
      },
    );
  }

  async readManyMyReviewWithUserId(
    userId: number,
    query: ReadManyLectureReviewQueryDto,
  ) {
    const { orderBy } = query;
    const order = [];

    order.push({ id: 'desc' });

    if (orderBy === '최신순') {
      order.push({
        reservation: {
          lectureSchedule: {
            startDateTime: 'desc',
          },
        },
      });
    } else if (orderBy === '좋아요순') {
      order.push({
        likedLectureReview: {
          _count: 'desc',
        },
      });
    } else if (orderBy === '평점 높은순') {
      order.push({ stars: 'desc' });
    } else if (orderBy === '평점 낮은순') {
      order.push({ stars: 'asc' });
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

    const order = [];
    order.push({ id: 'desc' });

    if (orderBy === '최신순') {
      order.push({
        reservation: {
          lectureSchedule: {
            startDateTime: 'desc',
          },
        },
      });
    } else if (orderBy === '좋아요순') {
      order.push({
        likedLectureReview: {
          _count: 'desc',
        },
      });
    } else if (orderBy === '평점 높은순') {
      order.push({ stars: 'desc' });
    } else if (orderBy === '평점 낮은순') {
      order.push({ stars: 'asc' });
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
      await this.lectureReviewRepository.readManyMyReviewWithLecturerId(
        where,
        order,
        take,
        cursor,
        skip,
      );
    const count =
      await this.lectureReviewRepository.readManyMyReviewCountWithLecturerId(
        lecturerId,
      );

    return { count, review };
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
    const orderBy = { id: 'desc' };

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
    const orderBy = { id: 'desc' };

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

  private async increaseLectureStars(
    transaction: PrismaTransaction,
    lectureId: number,
    stars: number,
  ) {
    const lecture = await transaction.lecture.findFirst({
      where: { id: lectureId },
    });

    const prevLectureReviewCount = lecture.reviewCount;
    const prevLectureStars = lecture.stars;
    const nextLectureReviewCount = prevLectureReviewCount + 1;
    const nextLectureStars =
      (prevLectureStars * prevLectureReviewCount + stars) /
      nextLectureReviewCount;
    const roundLectureStars = Math.round(nextLectureStars * 100) / 100;

    await this.lectureReviewRepository.trxIncreaseLectureReviewCount(
      transaction,
      lectureId,
    );
    await this.lectureReviewRepository.trxIncreaseLectureStars(
      transaction,
      lectureId,
      roundLectureStars,
    );
  }

  private async increaseLecturerStars(
    transaction: PrismaTransaction,
    lecturerId: number,
    stars: number,
  ) {
    const lecturer = await transaction.lecturer.findFirst({
      where: { id: lecturerId },
    });
    const prevLecturerReviewCount = lecturer.reviewCount;
    const prevLecturerStars = lecturer.stars;
    const nextLecturerReviewCount = prevLecturerReviewCount + 1;
    const nextLecturerStars =
      (prevLecturerStars * prevLecturerReviewCount + stars) /
      nextLecturerReviewCount;
    const roundLecturerStars = Math.round(nextLecturerStars * 100) / 100;

    await this.lectureReviewRepository.trxIncreaseLecturerReviewCount(
      transaction,
      lecturerId,
    );
    await this.lectureReviewRepository.trxIncreaseLecturerStars(
      transaction,
      lecturerId,
      roundLecturerStars,
    );
  }

  private async decreaseLectureStars(
    transaction: PrismaTransaction,
    lectureId: number,
    stars: number,
  ) {
    const lecture = await transaction.lecture.findFirst({
      where: { id: lectureId },
    });

    const prevLectureReviewCount = lecture.reviewCount;
    const prevLectureStars = lecture.stars;
    const nextLectureReviewCount = prevLectureReviewCount - 1;
    const nextLectureStars =
      (prevLectureStars * prevLectureReviewCount - stars) /
      nextLectureReviewCount;
    const roundLectureStars = Math.round(nextLectureStars * 100) / 100;

    await this.lectureReviewRepository.trxDecreaseLectureReviewCount(
      transaction,
      lectureId,
    );
    await this.lectureReviewRepository.trxDecreaseLectureStars(
      transaction,
      lectureId,
      roundLectureStars,
    );
  }

  private async decreaseLecturerStars(
    transaction: PrismaTransaction,
    lecturerId: number,
    stars: number,
  ) {
    const lecturer = await transaction.lecturer.findFirst({
      where: { id: lecturerId },
    });
    const prevLecturerReviewCount = lecturer.reviewCount;
    const prevLecturerStars = lecturer.stars;
    const nextLecturerReviewCount = prevLecturerReviewCount - 1;
    const nextLecturerStars =
      (prevLecturerStars * prevLecturerReviewCount - stars) /
      nextLecturerReviewCount;
    const roundLecturerStars = Math.round(nextLecturerStars * 100) / 100;

    await this.lectureReviewRepository.trxDecreaseLecturerReviewCount(
      transaction,
      lecturerId,
    );
    await this.lectureReviewRepository.trxDecreaseLecturerStars(
      transaction,
      lecturerId,
      roundLecturerStars,
    );
  }
}
