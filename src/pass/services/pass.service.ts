import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLecturePassDto } from '@src/pass/dtos/create-lecture-pass.dto';
import { ConfigService } from '@nestjs/config';
import { PassRepository } from '@src/pass/repository/pass.repository';
import { Id, PrismaTransaction } from '@src/common/interface/common-interface';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  LecturePassInputData,
  LecturePassTargetInputData,
} from '@src/pass/interface/interface';

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
}
