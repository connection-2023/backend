import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { Lecture, PrismaPromise, Region } from '@prisma/client';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';
import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction, Id } from '@src/common/interface/common-interface';

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly queryFilter: QueryFilter,
    private readonly prismaService: PrismaService,
  ) {}

  // async createLecture(
  //   createLectureDto: CreateLectureDto,
  //   lecturerId: number,
  //   imageUrl: string[],
  // ) {
  //   const { regions, schedule, ...lecture } = createLectureDto;

  //   const regionIds: Id[] = await this.getValidRegionIds(regions);

  //   return await this.prismaService.$transaction(
  //     async (transaction: PrismaTransaction) => {
  //       const newLecture = await this.lectureRepository.trxCreateLecture(
  //         transaction,
  //         lecturerId,
  //         lecture,
  //       );

  //       const lectureToRegionInputData: LectureToRegionInputData[] =
  //         this.createLectureToRegionInputData(newLecture.id, regionIds);
  //       await this.lectureRepository.trxCreateLectureToRegions(
  //         transaction,
  //         lectureToRegionInputData,
  //       );

  //       const lectureImageInputData: LectureImageInputData[] =
  //         this.createLectureImageInputData(newLecture.id, imageUrl);
  //       const newLectureImage =
  //         await this.lectureRepository.trxCreateLectureImg(
  //           transaction,
  //           lectureImageInputData,
  //           newLecture.id,
  //         );
  //       console.log(lectureImageInputData);

  //       const scheduleInputData = [];
  //       schedule.map((date) => {
  //         scheduleInputData.push({
  //           lectureId: newLecture.id,
  //           startDateTime: new Date(date),
  //           numberOfParticipants: 0,
  //         });
  //       });
  //       const newLectureSchedule =
  //         await this.lectureRepository.trxCreateLectureSchedule(
  //           transaction,
  //           scheduleInputData,
  //         );

  //       return { newLecture, newLectureImage, newLectureSchedule };
  //     },
  //   );
  // }
  // private async getValidRegionIds(regions: string[]): Promise<Id[]> {
  //   const extractRegions: Region[] = this.extractRegions(regions);
  //   const regionIds: Id[] = await this.lectureRepository.getRegionsId(
  //     extractRegions,
  //   );
  //   if (regionIds.length !== extractRegions.length) {
  //     throw new BadRequestException(
  //       `유효하지 않은 주소입니다.`,
  //       'InvalidAddress',
  //     );
  //   }

  //   return regionIds;
  // }

  // private extractRegions(regions) {
  //   const extractedRegions: Region[] = regions.map((region) => {
  //     const addressParts = region.split(' ');
  //     let administrativeDistrict = null;
  //     let district = null;

  //     if (addressParts[0] === '세종특별자치시') {
  //       administrativeDistrict = addressParts.shift();
  //     }
  //     if (addressParts[0].endsWith('시') || addressParts[0].endsWith('도')) {
  //       administrativeDistrict = addressParts.shift();
  //     } else {
  //       throw new BadRequestException(
  //         `잘못된 주소형식입니다.`,
  //         'InvalidAddressFormat',
  //       );
  //     }

  //     if (
  //       addressParts[0].endsWith('시') ||
  //       addressParts[0].endsWith('군') ||
  //       addressParts[0].endsWith('구')
  //     ) {
  //       district = addressParts.shift();
  //     } else {
  //       throw new BadRequestException(
  //         `잘못된 주소형식입니다`,
  //         'InvalidAddressFormat',
  //       );
  //     }

  //     return { administrativeDistrict, district };
  //   });

  //   return extractedRegions;
  // }

  // private createLectureToRegionInputData(
  //   lectureId: number,
  //   regionIds: Id[],
  // ): LectureToRegionInputData[] {
  //   const lectureInputData: LectureToRegionInputData[] = regionIds.map(
  //     (regionId) => ({
  //       lectureId,
  //       regionId: regionId.id,
  //     }),
  //   );

  //   return lectureInputData;
  // }

  // private createLectureImageInputData(lectureId: number, imageUrl: string[]) {
  //   const imageInputData: LectureImageInputData[] = imageUrl.map((url) => ({
  //     lectureId: lectureId,
  //     imageUrl: url,
  //   }));
  //   return imageInputData;
  // }

  // async readManyLecture(query: ReadManyLectureQueryDto): Promise<Lecture> {
  //   const { ...filter } = query;
  //   const where = this.queryFilter.buildWherePropForFind(filter);

  //   const readManyLectureQuery: PrismaPromise<any> =
  //     this.prismaService.lecture.findMany({
  //       where: {
  //         ...where,
  //         deletedAt: null,
  //       },
  //       select: {
  //         id: true,
  //         title: true,
  //         price: true,
  //         stars: true,
  //         reviewCount: true,
  //         duration: true,
  //         lecturer: {
  //           select: {
  //             id: true,
  //             nickname: true,
  //           },
  //         },
  //         region: true,
  //         danceCategory: true,
  //         lectureMethod: true,
  //       },
  //     });
  //   return readManyLectureQuery;
  // }

  // async readOneLecture(lectureId: number): Promise<any> {
  //   return await this.prismaService.lecture.findFirst({
  //     where: { id: lectureId },
  //     include: {
  //       region: true,
  //       lectureMethod: true,
  //       lecturer: {
  //         select: { id: true, nickname: true },
  //       },
  //       lectureReview: {
  //         select: {
  //           users: { select: { id: true, nickname: true } },
  //           stars: true,
  //           description: true,
  //         },
  //       },
  //     },
  //   });
  // }

  // async updateLecture(
  //   lecture: UpdateLectureDto,
  //   lectureId: number,
  // ): Promise<any> {
  //   return await this.prismaService.lecture.update({
  //     where: { id: lectureId },
  //     data: { ...lecture },
  //   });
  // }

  // async deleteLecture(lectureId: number): Promise<any> {
  //   return this.prismaService.lecture.delete({ where: { id: lectureId } });
  // }
}
