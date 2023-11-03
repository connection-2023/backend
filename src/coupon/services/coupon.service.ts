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
import { UpdateCouponTargetDto } from '../dtos/update-coupon-target.dto';

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
    const selectedLectureIds: Id[] =
      await this.couponRepository.getLecturerLecture(lecturerId, lectureIds);

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

  async applyLectureCoupon(
    lecturerId,
    couponId,
    { lectureIds }: UpdateCouponTargetDto,
  ): Promise<void> {
    await this.validateLectureIds(lecturerId, lectureIds);
    const validatedLectureIds: number[] = await this.validateLectureCoupon(
      lecturerId,
      couponId,
      lectureIds,
    );
    if (!validatedLectureIds) {
      return;
    }

    await this.createCouponTarget(couponId, validatedLectureIds);
  }

  private async createCouponTarget(lectureCouponId, lectureIds) {
    const couponTargetInputData: CouponTargetInputData = lectureIds.map(
      (lectureId) => ({
        lectureCouponId,
        lectureId,
      }),
    );
    await this.couponRepository.createCouponTarget(couponTargetInputData);
  }

  private async validateLectureCoupon(
    lecturerId: number,
    couponId: number,
    lectureIds: number[],
  ): Promise<number[]> {
    const coupon = await this.couponRepository.getLectureCoupon(
      lecturerId,
      couponId,
    );
    if (!coupon) {
      throw new BadRequestException(
        `존재하지 않거나 유효하지 않은 쿠폰이 포함되었습니다.`,
        'InvalidCouponIncluded',
      );
    }

    const couponTarget = await this.couponRepository.getCouponTargets(
      couponId,
      lectureIds,
    );
    if (couponTarget) {
      const couponTargetLectureIds = couponTarget.map(
        (couponTarget) => couponTarget.lectureId,
      );
      return lectureIds.filter((id) => !couponTargetLectureIds.includes(id));
    }

    return lectureIds;
  }
}
