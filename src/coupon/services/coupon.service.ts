import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateLectureCouponDto } from '../dtos/create-lecture-coupon.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  CouponInputData,
  CouponTargetInputData,
  LectureData,
} from '../interface/interface';
import { CouponRepository } from '../repository/coupon.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { LectureCoupon } from '@prisma/client';

@Injectable()
export class CouponService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly couponRepository: CouponRepository,
  ) {}

  async createLectureCoupon(
    lecturerId: number,
    createLectureCouponDto: CreateLectureCouponDto,
  ): Promise<void> {
    const { lectureIds, ...couponInfo } = createLectureCouponDto;
    const couponInputData: CouponInputData = {
      lecturerId,
      ...couponInfo,
    };

    if (lectureIds) {
      await this.validateLectureIds(lecturerId, lectureIds);
    }

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const createdCoupon: LectureCoupon =
          await this.couponRepository.trxCreateLectureCoupon(
            transaction,
            couponInputData,
          );

        if (lectureIds) {
          const createCouponTargetInputData: CouponTargetInputData[] =
            this.createCouponTargetInputData(createdCoupon.id, lectureIds);
          await this.couponRepository.trxCreateLectureCouponTarget(
            transaction,
            createCouponTargetInputData,
          );
        }
      },
    );
  }

  private async validateLectureIds(
    lecturerId: number,
    lectureIds: number[],
  ): Promise<void> {
    const lectureData: LectureData[] = lectureIds.map((lectureId: number) => ({
      id: lectureId,
      lecturerId,
    }));

    const selectedLectureIds: Id[] =
      await this.couponRepository.getLecturerLecture(lectureData);
    if (lectureIds.length !== selectedLectureIds.length) {
      throw new BadRequestException(
        `유효하지 않은 클래스가 포함되었습니다.`,
        'InvalidClassIncluded',
      );
    }
  }

  private createCouponTargetInputData(
    couponId: number,
    lectureIds: number[],
  ): CouponTargetInputData[] {
    const couponTargetInputData: CouponTargetInputData[] = lectureIds.map(
      (lectureId: number) => ({
        lectureId,
        lectureCouponId: couponId,
      }),
    );

    return couponTargetInputData;
  }
}
