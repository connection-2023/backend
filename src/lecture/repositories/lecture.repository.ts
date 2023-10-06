import { QueryFilter } from '@src/common/filters/query.filter';
import { PrismaService } from './../../prisma/prisma.service';
import { CreateLectureDto } from '../dtos/create-lecture.dto';
export class LectureRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryFilter: QueryFilter,
  ) {}

  async createLecture(
    lecturerId: number,
    lecture: CreateLectureDto,
    reservationDeadline: Date,
    imgUrl: string[],
  ): Promise<any> {
    return await this.prismaService.lecture.create({
      data: {
        lecturerId,
        ...lecture,
        reservationDeadline,
      },
    });
  }
}
