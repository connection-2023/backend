import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturerRegionInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
  LecturerInputData,
  LecturerUpdateData,
  LecturerInstagramPostInputData,
} from '@src/lecturer/interface/lecturer.interface';
import {
  IPaginationParams,
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { Lecture, Lecturer, LikedLecturer } from '@prisma/client';
import { PaymentOrderStatus } from '@src/payments/constants/enum';
import { LecturerLearnerPassInfoDto } from '../dtos/response/lecturer-learner-pass-item';

@Injectable()
export class LecturerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async trxCreateLecturer(
    transaction: PrismaTransaction,
    lecturerCreateInput: LecturerInputData,
  ): Promise<Lecturer> {
    return await transaction.lecturer.create({
      data: lecturerCreateInput,
    });
  }

  async getLecturerByUserId(userId: number): Promise<Lecturer> {
    return await this.prismaService.lecturer.findUnique({ where: { userId } });
  }

  async trxCreateLecturerRegions(
    transaction: PrismaTransaction,
    lecturerInputData: LecturerRegionInputData[],
  ): Promise<void> {
    await transaction.lecturerRegion.createMany({ data: lecturerInputData });
  }

  async trxCreateLecturerInstagramPost(
    transaction: PrismaTransaction,
    lecturerInstagramPostInputData: LecturerInstagramPostInputData[],
  ): Promise<void> {
    try {
      await transaction.lecturerInstagramPostUrl.createMany({
        data: lecturerInstagramPostInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 웹사이트 생성 실패: ${error}`,
        'LecturerInstagramPostUrlsCreateFailed',
      );
    }
  }

  async trxCreateLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerDanceGenresInputData: LecturerDanceGenreInputData[],
  ): Promise<void> {
    await transaction.lecturerDanceGenre.createMany({
      data: lecturerDanceGenresInputData,
    });
  }

  async getRegionsId(regions: Region[]): Promise<Id[]> {
    const regionsId: Id[] = await this.prismaService.region.findMany({
      where: { OR: regions },
      select: { id: true },
    });
    return regionsId;
  }

  async getLecturerNickname(nickname: string): Promise<{ nickname: string }> {
    return await this.prismaService.lecturer.findUnique({
      where: { nickname },
      select: { nickname: true },
    });
  }

  async trxCreateLecturerProfileImages(
    transaction: PrismaTransaction,
    lecturerProfileImageInputData: LecturerProfileImageInputData[],
  ): Promise<void> {
    try {
      await transaction.lecturerProfileImageUrl.createMany({
        data: lecturerProfileImageInputData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 프로필 이미지 생성 실패: ${error}`,
        'LecturerProfileImageUpdateFailed',
      );
    }
  }

  async getLecturerCouponsByLecturerId(
    lecturerId: number,
  ): Promise<LecturerCoupon[]> {
    return await this.prismaService.lectureCoupon.findMany({
      where: { lecturerId, isDisabled: false },
      select: {
        id: true,
        title: true,
        percentage: true,
        discountPrice: true,
        isStackable: true,
        maxDiscountPrice: true,
        startAt: true,
        endAt: true,
      },
    });
  }

  async updateLecturerNickname(lectureId, nickname) {
    await this.prismaService.lecturer.update({
      where: { id: lectureId },
      data: { nickname },
    });
  }

  async getLecturerProfile(lecturerId: number) {
    return await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId, deletedAt: null },
      include: {
        lecturerRegion: {
          include: {
            region: true,
          },
        },
        lecturerDanceGenre: {
          include: {
            danceCategory: true,
          },
        },
        lecturerInstagramPostUrl: {
          orderBy: { id: 'asc' },
        },
        lecturerProfileImageUrl: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async getLecturerBasicProfile(lecturerId) {
    return await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId, deletedAt: null },
      include: {
        users: { include: { auth: { include: { signUpType: true } } } },
      },
    });
  }

  async trxDeleteLecturerProfileImages(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    try {
      await transaction.lecturerProfileImageUrl.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 프로필 이미지 삭제 실패: ${error}`,
        'LecturerProfileImageDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerDanceGenres(
    transaction: PrismaTransaction,
    lecturerId: number,
  ): Promise<void> {
    try {
      await transaction.lecturerDanceGenre.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 장르 삭제 실패: ${error}`,
        'LecturerDanceGenresDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerRegions(
    transaction: PrismaTransaction,
    lecturerId: number,
  ) {
    try {
      await transaction.lecturerRegion.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 지역 삭제 실패: ${error}`,
        'LecturerRegionsDeleteFailed',
      );
    }
  }

  async trxDeleteLecturerInstagramPostUrls(
    transaction: PrismaTransaction,
    lecturerId: number,
  ) {
    try {
      await transaction.lecturerInstagramPostUrl.deleteMany({
        where: { lecturerId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사 인스타 포스트 삭제 실패: ${error}`,
        'LecturerInstagramUrlsDeleteFailed',
      );
    }
  }

  async trxUpdateLecturer(
    transaction: PrismaTransaction,
    lecturerId: number,
    lecturerUpdateData: LecturerUpdateData,
  ) {
    try {
      await transaction.lecturer.update({
        where: { id: lecturerId },
        data: lecturerUpdateData,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `강사정보 업데이트 실패: ${error}`,
        'LecturerUpdateFailed',
      );
    }
  }

  async getLecturerLeaners(
    lecturerId: number,
    { cursor, skip, take }: IPaginationParams,
    orderBy: Array<object> | object,
    user?: object,
  ) {
    try {
      return await this.prismaService.lecturerLearner.findMany({
        where: {
          lecturerId,
          user,
        },
        orderBy,
        take,
        cursor,
        skip,
        include: { user: { include: { userProfileImage: true } } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `수강생 조회 실패: ${error}`,
        'LecturerLearnerFindFailed',
      );
    }
  }

  async getUserReservation(userId: number) {
    try {
      return await this.prismaService.reservation.findFirst({
        where: { userId },
        orderBy: { id: 'desc' },
        include: {
          lectureSchedule: { include: { lecture: true } },
          regularLectureStatus: {
            include: { regularLectureSchedule: true, lecture: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `예약 정보 조회 실패: ${error}`,
        'ReservationLearnerFindFailed',
      );
    }
  }

  async getLecturerLearnerCount(lecturerId: number, user?: object) {
    try {
      return await this.prismaService.lecturerLearner.count({
        where: {
          lecturerId,
          user,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `수강생 조회 실패: ${error}`,
        'LecturerLearnerFindFailed',
      );
    }
  }

  async getUserLikedLecturerByLecturerId(
    userId: number,
    lecturerId: number,
  ): Promise<LikedLecturer> {
    try {
      return await this.prismaService.likedLecturer.findUnique({
        where: { lecturerId_userId: { userId, lecturerId } },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `종아요 목록 조회 실패: ${error}`,
        'LikedLecturerFindFailed',
      );
    }
  }

  async readManyLectureWithLectruerId(
    lecturerId: number,
    userId?: number,
  ): Promise<Lecture[]> {
    const include = {
      lectureImage: true,
      lectureToDanceGenre: {
        include: { danceCategory: true },
      },
      lectureToRegion: { select: { region: true } },
      lectureMethod: { select: { name: true } },
      lecturer: true,
    };

    userId ? (include['likedLecture'] = { where: { userId } }) : false;

    return await this.prismaService.lecture.findMany({
      where: { lecturerId, isActive: true },
      include,
      orderBy: { id: 'desc' },
    });
  }

  async getLecturesWithLecturerId(where): Promise<Lecture[]> {
    return await this.prismaService.lecture.findMany({
      where,
      include: { lectureMethod: true },
      orderBy: { id: 'desc' },
    });
  }

  async countLectureSchedules(lectureId: number): Promise<number> {
    return await this.prismaService.lectureSchedule.count({
      where: { lectureId },
    });
  }

  async countRegularLectureSchedules(lectureId: number): Promise<number> {
    return await this.prismaService.regularLectureSchedule.count({
      where: { regularLectureStatus: { lectureId } },
    });
  }

  async countCompletedLectureSchedules(
    lectureId: number,
    currentTime: Date,
  ): Promise<number> {
    return await this.prismaService.lectureSchedule.count({
      where: { lectureId, startDateTime: { lt: currentTime } },
    });
  }

  async countCompletedRegularLectureSchedules(
    lectureId: number,
    currentTime: Date,
  ): Promise<number> {
    return await this.prismaService.regularLectureSchedule.count({
      where: {
        regularLectureStatus: { lectureId },
        startDateTime: { lt: currentTime },
      },
    });
  }

  async getLecturerLearnerPaymentsOverview(lecturerId: number, userId: number) {
    return await this.prismaService.payment.findMany({
      where: { userId, lecturerId, statusId: PaymentOrderStatus.DONE },
      include: {
        paymentProductType: true,
        paymentCouponUsage: true,
        paymentPassUsage: {
          include: {
            lecturePass: true,
          },
        },
        reservation: {
          include: {
            lectureSchedule: { include: { lecture: true } },
            regularLectureStatus: { include: { lecture: true } },
          },
        },
        userPass: true,
      },
    });
  }

  async getUserPassList(
    lecturerId: number,
    userId: number,
  ): Promise<LecturerLearnerPassInfoDto[]> {
    // const currentDate = new Date();
    return await this.prismaService.userPass.findMany({
      where: {
        userId,
        lecturePass: { lecturerId },
        isEnabled: true,
        // endAt: { gt: currentDate },
        // remainingUses: {
        //   not: 0,
        // },
      },
      include: { lecturePass: true },
    });
  }

  async getLecturerReservationList(
    lecturerId: number,
    { cursor, skip, take }: IPaginationParams,
  ) {
    return await this.prismaService.reservation.findMany({
      where: { payment: { lecturerId }, isEnabled: true },
      include: {
        user: { include: { userProfileImage: true } },
        lectureSchedule: true,
        regularLectureStatus: {
          include: {
            regularLectureSchedule: true,
          },
        },
        lecture: true,
      },
      orderBy: {
        payment: {
          updatedAt: 'desc',
        },
      },
      cursor,
      skip,
      take,
    });
  }

  async getLecturerLearner(lecturerId: number, userId: number) {
    return await this.prismaService.lecturerLearner.findFirst({
      where: {
        lecturerId,
        userId,
      },
    });
  }

  async updateLearnerMemo(id: number, memo: string) {
    await this.prismaService.lecturerLearner.update({
      where: { id },
      data: { memo },
    });
  }
}
