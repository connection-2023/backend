import { QueryFilter } from '@src/common/filters/query.filter';
import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from '@src/lecture/dtos/create-lecture.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { Lecture, PrismaPromise } from '@prisma/client';
import { ReadManyLectureQueryDto } from '@src/lecture/dtos/read-many-lecture-query.dto';
import { UpdateLectureDto } from '@src/lecture/dtos/update-lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryFilter: QueryFilter,
  ) {}

  async createLecture(
    lecture: CreateLectureDto,
    danceLecturerId: number,
    imgurl: string[],
  ): Promise<any> {
    const reservationDeadline = new Date(lecture.reservationDeadline);
    return await this.prismaService.lecture.create({
      data: {
        danceLecturerId,
        ...lecture,
        reservationDeadline,
      },
    });
  }

  async readManyLecture(query: ReadManyLectureQueryDto): Promise<Lecture> {
    const { ...filter } = query;
    const where = this.queryFilter.buildWherePropForFind(filter);

    const readManyLectureQuery: PrismaPromise<any> =
      this.prismaService.lecture.findMany({
        where: {
          ...where,
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          price: true,
          stars: true,
          reviewCount: true,
          duration: true,
          lecturer: {
            select: {
              id: true,
              nickname: true,
            },
          },
          region: true,
          danceCategory: true,
          lectureMethod: true,
        },
      });
    return readManyLectureQuery;
  }

  async readOneLecture(lectureId: number): Promise<any> {
    return await this.prismaService.lecture.findFirst({
      where: { id: lectureId },
      include: {
        region: true,
        lectureMethod: true,
        lecturer: {
          select: { id: true, nickname: true },
        },
        lectureReview: {
          select: {
            users: { select: { id: true, nickname: true } },
            stars: true,
            description: true,
          },
        },
      },
    });
  }

  async updateLecture(
    lecture: UpdateLectureDto,
    lectureId: number,
  ): Promise<any> {
    return await this.prismaService.lecture.update({
      where: { id: lectureId },
      data: { ...lecture },
    });
  }

  async deleteLecture(lectureId: number): Promise<any> {
    return this.prismaService.lecture.delete({ where: { id: lectureId } });
  }
}
