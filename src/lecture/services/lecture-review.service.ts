import {
  IPaginationOptions,
  IPaginationParams,
  ValidateResult,
} from './../../common/interface/common-interface';
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
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { LecturerReviewResultDto } from '../dtos/read-lecturer-review.dto';
import { OrderByEnum } from '@src/common/enum/enum';
import { CombinedLectureReviewWithCountDto } from '../dtos/combined-lecture-review-with-count.dto';

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
    lectureId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      orderBy,
    }: ReadManyLecturerReviewQueryDto,
    userId?: number,
  ) {
    const order = this.getLectureReviewSortOption(orderBy);

    const paginationParams: IPaginationParams = this.getPaginationParams({
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    });

    const reviews = await this.lectureReviewRepository.readManyLectureReview(
      lectureId,
      order,
      paginationParams,
      userId,
    );

    const reviewCount = await this.lectureReviewRepository.countLectureReview(
      lectureId,
    );

    return new CombinedLectureReviewWithCountDto({
      reviews,
      reviewCount,
    });
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

    const order = this.getLectureReviewSortOption(orderBy);

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
    let count: number;
    const where = { lecture: { lecturerId } };

    if (lecturerMyReviewType === '진행중인 클래스') {
      where.lecture['isActive'] = true;
      count = await this.prismaService.lectureReview.count({
        where: { lecture: { isActive: true, lecturerId } },
      });
    } else if (lecturerMyReviewType === '종료된 클래스') {
      where.lecture['isActive'] = false;
      count = await this.prismaService.lectureReview.count({
        where: { lecture: { isActive: false, lecturerId } },
      });
    } else if (lecturerMyReviewType === '전체') {
      count = await this.prismaService.lectureReview.count({
        where: { lecture: { lecturerId } },
      });
    }

    if (lectureId) {
      where['lectureId'] = lectureId;
    }

    const order = this.getLectureReviewSortOption(orderBy);

    const paginationParams: IPaginationParams = this.getPaginationParams({
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    });

    const review =
      await this.lectureReviewRepository.readManyMyReviewWithLecturerId(
        where,
        order,
        paginationParams,
      );

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
      orderBy,
    }: ReadManyLecturerReviewQueryDto,
    userId?: number,
  ) {
    const existReview = await this.prismaService.lectureReview.findFirst({
      where: { lecture: { lecturerId } },
    });

    if (!existReview) {
      return;
    }

    const paginationParams: IPaginationParams = this.getPaginationParams({
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    });

    const order = this.getLectureReviewSortOption(orderBy);

    const reviews = await this.lectureReviewRepository.readManyLecturerReview(
      lecturerId,
      order,
      paginationParams,
      userId,
    );
    const reviewCount = await this.prismaService.lectureReview.count({
      where: { lecture: { lecturerId } },
    });

    return new LecturerReviewResultDto({ reviews, reviewCount });
  }

  private getPaginationParams({
    currentPage,
    targetPage,
    firstItemId,
    lastItemId,
    take,
  }: IPaginationOptions): IPaginationParams {
    let cursor;
    let skip;
    let updatedTake = take;

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      cursor = { id: pageDiff <= -1 ? lastItemId : firstItemId };
      skip = Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
      updatedTake = pageDiff >= 1 ? -take : take;
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    return { cursor, skip, take: updatedTake };
  }

  private getLectureReviewSortOption(orderBy: OrderByEnum) {
    const order = [];

    switch (orderBy) {
      case OrderByEnum.LATEST:
        order.push({
          reservation: {
            lectureSchedule: {
              startDateTime: 'desc',
            },
          },
        });
        break;

      case OrderByEnum.LIKES_DESC:
        order.push({
          likedLectureReview: {
            _count: 'desc',
          },
        });
        break;

      case OrderByEnum.STARS_DESC:
        order.push({ stars: 'desc' });
        break;

      case OrderByEnum.STARS_ASC:
        order.push({ stars: 'asc' });
        break;
    }

    order.push({ id: 'desc' });

    return order;
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
    const roundLectureStars = Math.round(nextLectureStars * 10) / 10;

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
    const roundLecturerStars = Math.round(nextLecturerStars * 10) / 10;

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
    const roundLectureStars = Math.round(nextLectureStars * 10) / 10;

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
    const roundLecturerStars = Math.round(nextLecturerStars * 10) / 10;

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
