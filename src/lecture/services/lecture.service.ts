import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { Lecture, PrismaPromise } from '@prisma/client';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';
import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from '@src/prisma/prisma.service';
import { PrismaTransaction } from '@src/common/interface/common-interface';

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly queryFilter: QueryFilter,
    private readonly prismaService: PrismaService,
  ) {}

  async createLecture(
    createLectureDto: CreateLectureDto,
    lecturerId: number,
    imgUrl: string[],
  ) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const { schedule, ...lecture } = createLectureDto;
        const newLecture = await this.lectureRepository.trxCreateLecture(
          transaction,
          lecturerId,
          lecture,
        );

        const scheduleArr = [];
        schedule.map((date) => {
          scheduleArr.push({
            lectureId: 1,
            startDateTime: new Date(date),
            numberOfParticipants: 0,
          });
        });
        const newLectureSchedule =
          await this.lectureRepository.trxCreateLectureSchedule(
            transaction,
            scheduleArr,
          );

        return { newLecture, newLectureSchedule };
      },
    );
  }

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
