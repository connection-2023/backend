import { LectureLikeRepository } from './../../lecture/repositories/lecture-like.repository';
import { LecturerLikeRepository } from './../repositories/lecturer-like.repository';
import { Injectable } from '@nestjs/common';
import { LecturerBlockRepository } from '../repositories/lecturer-block.repository';

@Injectable()
export class LecturerBlockService {
  constructor(
    private readonly lecturerBlockRepository: LecturerBlockRepository,
    private readonly lecturerLikeRepository: LecturerLikeRepository,
    private readonly lectureLikeRepository: LectureLikeRepository,
  ) {}

  async createLecturerBlock(lecturerId: number, userId: number) {
    const lecturerLikeExist =
      await this.lecturerLikeRepository.findUserLikeLecturerByUserIdAndLecturerId(
        userId,
        lecturerId,
      );

    if (lecturerLikeExist) {
      await this.lecturerLikeRepository.deleteLecturerLike(lecturerId, userId);
    }

    const lecturesLikeExist =
      await this.lectureLikeRepository.findUserLikeLecturesByUserIdAndLecturerId(
        userId,
        lecturerId,
      );

    if (lecturesLikeExist) {
      await this.lectureLikeRepository.deleteUserLikeLectureByUserIdAndLecturerId(
        userId,
        lecturerId,
      );
    }

    return await this.lecturerBlockRepository.createLecturerBlock(
      lecturerId,
      userId,
    );
  }

  async deleteLecturerBlock(lecturerId: number, userId: number) {
    return await this.lecturerBlockRepository.deleteLecturerBlock(
      lecturerId,
      userId,
    );
  }

  async readManyLecturerBlock(userId: number) {
    const lecturerBlock =
      await this.lecturerBlockRepository.readManyLecturerBlock(userId);
    const count = await this.lecturerBlockRepository.getCountLecturerBlock(
      userId,
    );

    return { count, lecturerBlock };
  }
}
