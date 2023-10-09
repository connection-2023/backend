import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateLecturerDto } from '../dtos/create-lecturer.dto';
import { LecturerRepository } from '../repositories/lecturer.repository';
import {
  Id,
  PrismaTransaction,
  Region,
} from '@src/common/interface/common-interface';
import { RegionRepository } from '@src/region/repository/region.repository';
import { Lecturer } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { LecturerInputData } from '../interface/lecturer.interface';

@Injectable()
export class LecturerService implements OnModuleInit {
  private readonly logger = new Logger(LecturerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly lecturerRepository: LecturerRepository,
    private readonly regionRepository: RegionRepository,
  ) {}

  onModuleInit() {
    this.logger.log('LecturerService Init');
  }

  async createLecturer(userId: number, createLecturerDto: CreateLecturerDto) {
    await this.checkLecturerExist(userId);

    const { regions, genres, websiteUrls, ...lecturerData } = createLecturerDto;

    const regionIds: Id[] = await this.getRegionsId(regions);

    await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const lecturer: Lecturer =
          await this.lecturerRepository.trxCreateLecturer(transaction, {
            userId,
            ...lecturerData,
          });

        const lecturerInputData: LecturerInputData[] =
          this.createLecturerInputData(lecturer.id, regionIds);
        await this.lecturerRepository.trxCreateLecturerRegions(
          transaction,
          lecturerInputData,
        );
      },
    );
  }

  private async checkLecturerExist(userId): Promise<void> {
    const lecturer: Lecturer =
      await this.lecturerRepository.getLecturerByUserId(userId);
    if (lecturer) {
      throw new BadRequestException(
        `이미 강사정보가 생성 되었습니다.`,
        'lecturerAlreadyExists',
      );
    }
  }
  private async getRegionsId(regions: string[]): Promise<Id[]> {
    const extractRegions: Region[] = this.extractRegions(regions);
    const regionIds: Id[] = await this.regionRepository.getRegionsId(
      extractRegions,
    );
    if (regionIds.length !== extractRegions.length) {
      throw new BadRequestException(
        `유효하지 않은 주소입니다.`,
        'InvalidAddress',
      );
    }

    return regionIds;
  }

  private extractRegions(regions) {
    const extractedRegions: Region[] = regions.map((region) => {
      const addressParts = region.split(' ');
      let administrativeDistrict = null;
      let district = null;

      if (addressParts[0] === '세종특별자치시') {
        administrativeDistrict = addressParts.shift();
      }
      if (addressParts[0].endsWith('시') || addressParts[0].endsWith('도')) {
        administrativeDistrict = addressParts.shift();
      } else {
        throw new BadRequestException(
          `잘못된 주소형식입니다`,
          'InvalidAddressFormat',
        );
      }

      if (
        addressParts[0].endsWith('시') ||
        addressParts[0].endsWith('군') ||
        addressParts[0].endsWith('구')
      ) {
        district = addressParts.shift();
      }

      return { administrativeDistrict, district };
    });

    // 추출된 지역 데이터를 반환
    return extractedRegions;
  }

  private createLecturerInputData(
    lecturerId: number,
    regionIds: Id[],
  ): LecturerInputData[] {
    const lecturerInputData: LecturerInputData[] = regionIds.map(
      (regionId) => ({
        lecturerId,
        regionId: regionId.id,
      }),
    );

    return lecturerInputData;
  }
}
