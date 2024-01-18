import { LectureRepository } from '@src/lecture/repositories/lecture.repository';
import { Injectable } from '@nestjs/common';
import { LectureDto } from '@src/common/dtos/lecture.dto';

@Injectable()
export class LatestLectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  async readManyLatestLectureWithUserId(userId: number): Promise<LectureDto[]> {
    const lectures =
      await this.lectureRepository.readManyLatestLecturesWithUserId(userId);

    return lectures.map((lecture) => new LectureDto(lecture));
  }

  async readManyLatestLecturesByNonMember(): Promise<LectureDto[]> {
    const lectures =
      await this.lectureRepository.readManyLatestLecturesByNonMember();

    return lectures.map((lecture) => new LectureDto(lecture));
  }
}
