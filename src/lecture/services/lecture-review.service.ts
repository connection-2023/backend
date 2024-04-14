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
import { LecturerMyReviewType, OrderByEnum } from '@src/common/enum/enum';
import { CombinedLectureReviewWithCountDto } from '../dtos/combined-lecture-review-with-count.dto';
import { CombinedMyReviewWithCountDto } from '../dtos/combined-my-review-with-count.dto';
import { LectureReviewRatingsDto } from '../dtos/lecture-review-ratings.dto';

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
    const totalItemCount = reviews[0] ? reviews[0].lecture.reviewCount : 0;
    const totalStars = reviews[0] ? reviews[0].lecture.stars : 0;

    return new CombinedLectureReviewWithCountDto(
      reviews,
      totalItemCount,
      totalStars,
    );
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
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      orderBy,
    }: ReadManyLecturerReviewQueryDto,
  ) {
    const order = this.getLectureReviewSortOption(orderBy);
    const paginationParams: IPaginationParams = this.getPaginationParams({
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    });
    const totalItemCount =
      await this.lectureReviewRepository.readManyMyReviewCountWithUserId(
        userId,
      );
    const reviews =
      await this.lectureReviewRepository.readManyMyReviewWithUserId(
        userId,
        order,
        paginationParams,
      );

    return new CombinedMyReviewWithCountDto(reviews, totalItemCount);
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
    const where = this.getLecturerMyReviewType(
      lecturerMyReviewType,
      lecturerId,
      lectureId,
    );

    const totalItemCount = await this.prismaService.lectureReview.count({
      where,
    });
    const order = this.getLectureReviewSortOption(orderBy);
    const paginationParams: IPaginationParams = this.getPaginationParams({
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      take,
    });
    const reviews =
      await this.lectureReviewRepository.readManyMyReviewWithLecturerId(
        where,
        order,
        paginationParams,
      );

    return new CombinedMyReviewWithCountDto(reviews, totalItemCount);
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

    const totalItemCount = reviews[0]
      ? reviews[0].lecture['lecturer'].reviewCount
      : 0;
    const totalStars = reviews[0] ? reviews[0].lecture['lecturer'].stars : 0;

    return new CombinedLectureReviewWithCountDto(
      reviews,
      totalItemCount,
      totalStars,
    );
  }

  async getReviewRatingsAndCounts(authorizedData: ValidateResult) {
    const where = authorizedData.user
      ? { userId: authorizedData.user.id, deletedAt: null }
      : {
          lecture: { lecturerId: authorizedData.lecturer.id },
          deletedAt: null,
        };

    const ratings =
      await this.lectureReviewRepository.getReviewRatingsAndCountsByLecturerId(
        where,
      );
    return ratings.map((rating) => new LectureReviewRatingsDto(rating));
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

  private getLecturerMyReviewType(
    lecturerMyReviewType: LecturerMyReviewType,
    lecturerId: number,
    lectureId?: number,
  ) {
    const where = { lecture: { lecturerId } };

    switch (lecturerMyReviewType) {
      case LecturerMyReviewType.ONGOING:
        where.lecture['isActive'] = true;

        break;
      case LecturerMyReviewType.FINISHED:
        where.lecture['isActive'] = false;

        break;
      case LecturerMyReviewType.ALL:
        break;
    }

    if (!lectureId) {
      return where;
    }

    where['lectureId'] = lectureId;

    return where;
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
