import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureCouponDto } from '@src/coupon/dtos/create-lecture-coupon.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CouponInputData,
  CouponTargetInputData,
} from '@src/coupon/interface/interface';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { LectureCoupon, UserCoupon } from '@prisma/client';
import { UpdateCouponTargetDto } from '@src/coupon/dtos/update-coupon-target.dto';

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

  private async createCouponTarget(lectureCouponId, lectureIds): Promise<void> {
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
    const coupon = await this.couponRepository.getLectureCouponByLecturerId(
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

  async getLectureCoupon(userId, couponId): Promise<void> {
    const isOwn = false;
    const isPrivate = false;
    await this.checkUserCoupon(userId, couponId, isOwn, isPrivate);

    await this.couponRepository.createUserCoupon(userId, couponId);
  }

  private async checkUserCoupon(
    userId: number,
    couponId: number,
    isOwn: boolean,
    isPrivate: boolean,
  ): Promise<void> {
    const userCoupon: UserCoupon = await this.couponRepository.getUserCoupon(
      userId,
      couponId,
    );

    if (!userCoupon && isOwn) {
      throw new BadRequestException(
        `쿠폰을 보유하고있지 않습니다.`,
        'CouponNotOwned',
      );
    }
    if (userCoupon && !isOwn) {
      throw new BadRequestException(
        `이미 쿠폰을 보유하고있습니다.`,
        'CouponAlreadyOwned',
      );
    }

    if (!isOwn) {
      const coupon = await this.couponRepository.getLectureCoupon(couponId);

      if (!coupon) {
        throw new NotFoundException(
          `쿠폰이 존재하지 않습니다.`,
          'CouponNotFound',
        );
      }
      if (coupon.isDisabled) {
        throw new BadRequestException(
          `비활성화 된 쿠폰입니다.`,
          'DisabledCoupon',
        );
      }
      if (coupon.maxUsageCount === coupon.usageCount) {
        throw new BadRequestException(
          `모든 쿠폰 할당량이 소진되었습니다.`,
          'CouponAllocationExhausted',
        );
      }
      if (coupon.isPrivate !== isPrivate) {
        throw new BadRequestException(
          `해당 쿠폰은 ${coupon.isPrivate ? '비공개' : '공개'}쿠폰 입니다.`,
          'InvalidCouponType',
        );
      }
    }
  }
}
