import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureCouponDto } from '@src/coupon/dtos/create-lecture-coupon.dto';
import {
  CouponInputData,
  CouponTargetInputData,
} from '@src/coupon/interface/interface';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';
import { PrismaService } from '@src/prisma/prisma.service';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { LectureCoupon, LectureCouponTarget, UserCoupon } from '@prisma/client';
import { UpdateCouponTargetDto } from '@src/coupon/dtos/update-coupon-target.dto';
import { createCipheriv, Cipher, createDecipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { GetMyCouponListDto } from '@src/coupon/dtos/get-my-coupon-list.dto';
import {
  CouponFilterOptions,
  IssuedCouponStatusOptions,
  UserCouponStatusOptions,
} from '../enum/coupon.enum.ts';
import { GetMyIssuedCouponListDto } from '../dtos/get-my-issued-coupon-list.dto.js';
import { ICursor } from '@src/payments/interface/payments.interface.js';

@Injectable()
export class CouponService {
  private hexString: string;
  private iv: Buffer;
  private key: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly couponRepository: CouponRepository,
  ) {}

  onModuleInit() {
    this.key = this.configService.get<string>('COUPON_SECRET_KEY');
    this.hexString = this.configService.get<string>('HEX_STRING');
    this.iv = Buffer.from(this.hexString, 'hex');
  }

  async createLectureCoupon(
    lecturerId: number,
    createLectureCouponDto: CreateLectureCouponDto,
  ): Promise<LectureCoupon> {
    const { lectureIds, ...couponInfo } = createLectureCouponDto;
    const couponInputData: CouponInputData = {
      lecturerId,
      ...couponInfo,
    };

    if (lectureIds) {
      await this.validateLectureIds(lecturerId, lectureIds);
    }

    const coupon: LectureCoupon = await this.prismaService.$transaction(
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
        return createdCoupon;
      },
    );
    return coupon;
  }

  private async validateLectureIds(
    lecturerId: number,
    lectureIds: number[],
  ): Promise<void> {
    const selectedLectureIds: Id[] =
      await this.couponRepository.getLecturerLectures(lecturerId, lectureIds);

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

    const couponTarget: LectureCouponTarget[] =
      await this.couponRepository.getCouponTargets(couponId, lectureIds);
    if (couponTarget) {
      const couponTargetLectureIds = couponTarget.map(
        (couponTarget) => couponTarget.lectureId,
      );
      return lectureIds.filter((id) => !couponTargetLectureIds.includes(id));
    }

    return lectureIds;
  }

  async issuePublicCouponToUser(
    userId: number,
    couponId: number,
  ): Promise<void> {
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
  async getPrivateLectureCouponCode(
    lecturerId: number,
    couponId: number,
  ): Promise<string> {
    const isPrivate = true;
    await this.checkLecturerCoupon(lecturerId, couponId, isPrivate);

    const cipher: Cipher = createCipheriv('aes-128-cbc', this.key, this.iv);
    let encryptedCode: string = cipher.update(
      couponId.toString(),
      'utf8',
      'hex',
    );
    encryptedCode += cipher.final('hex');

    return encryptedCode;
  }

  private async checkLecturerCoupon(
    lecturerId: number,
    couponId: number,
    isPrivate: boolean,
  ) {
    const coupon: LectureCoupon = await this.couponRepository.getLecturerCoupon(
      lecturerId,
      couponId,
    );

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

  async getMyCouponList(
    userId: number,
    {
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
      couponStatusOption,
      filterOption,
    }: GetMyCouponListDto,
  ) {
    const totalItemCount = await this.couponRepository.countUserCoupons(userId);

    if (!totalItemCount) {
      return;
    }

    const { isUsed, orderBy, endAt } = this.getCouponFilterOptions(
      couponStatusOption,
      filterOption,
    );

    let couponList;
    let cursor;
    let skip;

    const isInitialRequest = !currentPage && !targetPage && !lastItemId;
    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isInitialRequest) {
      couponList = await this.getUserCouponList(
        userId,
        take,
        endAt,
        orderBy,
        isUsed,
      );
    } else if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));

      couponList = await this.getUserCouponList(
        userId,
        pageDiff >= 1 ? -take : take,
        endAt,
        orderBy,
        isUsed,
        cursor,
        skip,
      );
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;

      couponList = await this.getUserCouponList(
        userId,
        take,
        endAt,
        orderBy,
        isUsed,
        cursor,
        skip,
      );
    }

    return { totalItemCount, couponList };
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor: ICursor = { id: itemId };
    const skip =
      Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    const invertedTake = pageDiff >= 1 ? -take : take;

    return { cursor, skip, invertedTake };
  }

  private getCouponFilterOptions(
    couponStatusOption: UserCouponStatusOptions,
    filterOption: CouponFilterOptions,
  ) {
    const currentTime = new Date();
    let isUsed;
    let orderBy;
    let endAt;

    switch (couponStatusOption) {
      case UserCouponStatusOptions.AVAILABLE:
        isUsed = false;
        orderBy =
          filterOption === CouponFilterOptions.LATEST
            ? { id: 'desc' }
            : { lectureCoupon: { endAt: 'asc' } };
        endAt =
          filterOption === CouponFilterOptions.LATEST
            ? undefined
            : { gt: currentTime };

        return { isUsed, orderBy, endAt };

      case UserCouponStatusOptions.USED:
        isUsed = true;
        orderBy = { updatedAt: 'desc' };

        return { isUsed, orderBy, endAt };

      case UserCouponStatusOptions.EXPIRED:
        endAt = { lt: currentTime };
        orderBy = { lectureCoupon: { endAt: 'desc' } };

        return { isUsed, orderBy, endAt };
    }
  }

  private async getUserCouponList(
    userId: number,
    take: number,
    endAt: object,
    orderBy: object,
    isUsed: boolean,
    cursor?: ICursor,
    skip?: number,
  ) {
    return await this.couponRepository.getUserCouponList(
      userId,
      take,
      endAt,
      orderBy,
      isUsed,
      cursor,
      skip,
    );
  }

  async getMyIssuedCouponList(
    lecturerId: number,
    {
      issuedCouponStatusOptions,
      filterOption,
      lectureId,
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
    }: GetMyIssuedCouponListDto,
  ) {
    const totalItemCount: number =
      await this.couponRepository.countIssuedCoupons(lecturerId);
    if (!totalItemCount) {
      return;
    }

    let couponList;
    let cursor;
    let skip;

    const { OR, orderBy, endAt, lectureCouponTarget } =
      this.getIssuedCouponFilterOptions(
        issuedCouponStatusOptions,
        filterOption,
        lectureId,
      );

    const isInitialRequest = !currentPage && !targetPage && !lastItemId;
    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isInitialRequest) {
      couponList = await this.getIssuedCouponList(
        lecturerId,
        OR,
        orderBy,
        endAt,
        lectureCouponTarget,
        take,
      );
    } else if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));

      couponList = await this.getIssuedCouponList(
        lecturerId,
        OR,
        orderBy,
        endAt,
        lectureCouponTarget,
        pageDiff >= 1 ? -take : take,
        cursor,
        skip,
      );
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;

      couponList = await this.getIssuedCouponList(
        lecturerId,
        OR,
        orderBy,
        endAt,
        lectureCouponTarget,
        take,
        cursor,
        skip,
      );
    }

    return { totalItemCount, couponList };
  }

  private getIssuedCouponFilterOptions(
    issuedCouponStatusOptions: IssuedCouponStatusOptions,
    filterOption: CouponFilterOptions,
    lectureId: number,
  ) {
    const currentTime = new Date();
    let OR;
    let orderBy;
    let endAt;

    const lectureCouponTarget = lectureId ? { some: { lectureId } } : undefined;

    if (issuedCouponStatusOptions === IssuedCouponStatusOptions.AVAILABLE) {
      OR = [{ isDisabled: false }];
      endAt = { gt: currentTime };
      orderBy =
        filterOption === CouponFilterOptions.LATEST
          ? { id: 'desc' }
          : { endAt: 'asc' };

      return { OR, orderBy, endAt, lectureCouponTarget };
    }

    if (issuedCouponStatusOptions === IssuedCouponStatusOptions.DISABLED) {
      endAt = { lt: currentTime };
      OR = [{ isDisabled: true }, { endAt }];
      orderBy = { endAt: 'desc' };

      return { OR, orderBy, lectureCouponTarget };
    }
  }

  private async getIssuedCouponList(
    lecturerId: number,
    OR: Array<object>,
    orderBy: object,
    endAt: object,
    lectureCouponTarget: object,
    take: number,
    cursor?: ICursor,
    skip?: number,
  ) {
    return await this.couponRepository.getLecturerIssuedCouponList(
      lecturerId,
      OR,
      orderBy,
      endAt,
      lectureCouponTarget,
      take,
      cursor,
      skip,
    );
  }

  async getApplicableCouponsForLecture(lectureId: number) {
    const coupons = await this.couponRepository.getApplicableCouponsForLecture(
      lectureId,
    );

    const applicableCoupons = coupons.map((coupon) => {
      if (
        coupon.lectureCoupon.maxUsageCount !== coupon.lectureCoupon.usageCount
      ) {
        delete coupon.lectureCoupon.usageCount;
      }

      return coupon;
    });

    return applicableCoupons;
  }

  async issuePrivateCouponToUser(
    userId: number,
    couponCode: string,
  ): Promise<void> {
    const couponId: number = this.decodeCouponCode(couponCode);
    const isOwn = false;
    const isPrivate = true;

    await this.checkUserCoupon(userId, couponId, isOwn, isPrivate);

    await this.couponRepository.createUserCoupon(userId, couponId);
  }

  private decodeCouponCode(couponCode): number {
    const decipher = createDecipheriv('aes-128-cbc', this.key, this.iv);
    let decodedCouponCode = decipher.update(couponCode, 'hex', 'utf8');
    decodedCouponCode += decipher.final('utf8');

    return parseInt(decodedCouponCode);
  }
}
