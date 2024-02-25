import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLecturePassDto } from '@src/pass/dtos/create-lecture-pass.dto';
import { ConfigService } from '@nestjs/config';
import { PassRepository } from '@src/pass/repository/pass.repository';
import {
  ICursor,
  Id,
  PrismaTransaction,
} from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturePassInputData,
  LecturePassTargetInputData,
} from '@src/pass/interface/interface';
import { GetMyIssuedPassListDto } from '../dtos/get-my-issued-pass-list.dto';
import { IssuedPassFilterOptions, PassStatusOptions } from '../enum/pass.enum';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { LecturePass } from '@prisma/client';
import { MyPassDto } from '../dtos/pass.dto';
import { PassWithLecturerDto } from '../dtos/response/pass-with-lecturer.dto';

@Injectable()
export class PassService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly passRepository: PassRepository,
  ) {}

  async createLecturePass(
    lecturerId: number,
    createLecturePassDto: CreateLecturePassDto,
  ): Promise<void> {
    const { lectureIds, ...passInfo } = createLecturePassDto;
    await this.validateLectureIds(lecturerId, lectureIds);

    const passInputData: LecturePassInputData = { lecturerId, ...passInfo };
    await this.trxCreateLecturePass(lectureIds, passInputData);
  }

  private async validateLectureIds(
    lecturerId: number,
    lectureIds: number[],
  ): Promise<void> {
    const selectedLectureIds: Id[] =
      await this.passRepository.getLecturerLectures(lecturerId, lectureIds);

    if (lectureIds.length !== selectedLectureIds.length) {
      throw new BadRequestException(
        `유효하지 않은 클래스가 포함되었습니다.`,
        'InvalidClassIncluded',
      );
    }
  }

  private async trxCreateLecturePass(
    lectureIds: number[],
    passInputData,
  ): Promise<void> {
    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const createdPass = await this.passRepository.trxCreateLecturePass(
          transaction,
          passInputData,
        );

        if (lectureIds) {
          const createPassTargetInputData: LecturePassTargetInputData[] =
            this.createPassTargetInputData(createdPass.id, lectureIds);

          await this.passRepository.trxCreateLecturePassTarget(
            transaction,
            createPassTargetInputData,
          );
        }
        return createdPass;
      },
    );
  }

  private createPassTargetInputData(
    passId: number,
    lectureIds: number[],
  ): LecturePassTargetInputData[] {
    const PassTargetInputData: LecturePassTargetInputData[] = lectureIds.map(
      (lectureId: number) => ({
        lectureId,
        lecturePassId: passId,
      }),
    );

    return PassTargetInputData;
  }

  async getMyIssuedPassList(
    lecturerId,
    {
      passStatusOptions,
      filterOption,
      lectureId,
      take,
      currentPage,
      targetPage,
      firstItemId,
      lastItemId,
    }: GetMyIssuedPassListDto,
  ) {
    const totalItemCount: number = await this.passRepository.countIssuedPasses(
      lecturerId,
    );
    if (!totalItemCount) {
      return;
    }

    const { orderBy, isDisabled, lecturePassTarget } =
      await this.getIssuedCouponFilterOptions(
        passStatusOptions,
        filterOption,
        lectureId,
      );

    let cursor;
    let skip;

    const isPagination = currentPage && targetPage;
    const isInfiniteScroll = lastItemId && take;

    if (isPagination) {
      const pageDiff = currentPage - targetPage;
      ({ cursor, skip } = this.getPaginationOptions(
        pageDiff,
        pageDiff <= -1 ? lastItemId : firstItemId,
        take,
      ));
      take = pageDiff >= 1 ? -take : take;
    } else if (isInfiniteScroll) {
      cursor = { id: lastItemId };
      skip = 1;
    }

    const passList = await this.getIssuedPassList(
      lecturerId,
      take,
      isDisabled,
      orderBy,
      lecturePassTarget,
      cursor,
      skip,
    );

    return { totalItemCount, passList };
  }

  private async getIssuedCouponFilterOptions(
    passStatusOptions: PassStatusOptions,
    filterOption: IssuedPassFilterOptions,
    lectureId: number,
  ) {
    let orderBy;
    let isDisabled =
      passStatusOptions === PassStatusOptions.AVAILABLE ? false : true;
    const lecturePassTarget = lectureId ? { some: { lectureId } } : undefined;

    switch (filterOption) {
      case IssuedPassFilterOptions.LATEST:
        orderBy = { id: 'desc' };
        break;
      case IssuedPassFilterOptions.BEST_SELLING:
        orderBy = { salesCount: 'desc' };
        break;
      case IssuedPassFilterOptions.HIGHEST_PRICE:
        orderBy = { price: 'desc' };
        break;
    }

    return { orderBy, isDisabled, lecturePassTarget };
  }

  private getPaginationOptions(pageDiff: number, itemId: number, take: number) {
    const cursor: ICursor = { id: itemId };
    const skip =
      Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    const invertedTake = pageDiff >= 1 ? -take : take;

    return { cursor, skip, invertedTake };
  }

  private async getIssuedPassList(
    lecturerId: number,
    take: number,
    isDisabled: boolean,
    orderBy: object,
    lecturePassTarget: object,
    cursor?: ICursor,
    skip?: number,
  ) {
    return await this.passRepository.getIssuedLecturePasses(
      lecturerId,
      take,
      isDisabled,
      orderBy,
      lecturePassTarget,
      cursor,
      skip,
    );
  }

  async getLecturePassList(
    lectureId: number,
  ): Promise<LecturePassWithTargetDto[]> {
    return (await this.passRepository.getLecturePassList(lectureId)).map(
      (lecturePass) => new LecturePassWithTargetDto(lecturePass),
    );
  }

  async getLecturerPassList(
    lecturerId: number,
  ): Promise<LecturePassWithTargetDto[]> {
    return (await this.passRepository.getLecturerPassList(lecturerId)).map(
      (lecturePass) => new LecturePassWithTargetDto(lecturePass),
    );
  }

  async getMyPass(lecturerId: number, passId: number): Promise<MyPassDto> {
    const selectedPass: LecturePass =
      await this.passRepository.getPassByIdAndLecturerId(lecturerId, passId);

    return selectedPass ? new MyPassDto(selectedPass) : null;
  }

  async getPass(passId: number): Promise<PassWithLecturerDto> {
    const selectedPass = await this.passRepository.getPassWithLecturerById(
      passId,
    );

    return new PassWithLecturerDto(selectedPass);
  }
}
