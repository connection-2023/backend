import { Injectable } from '@nestjs/common';
import { LecturerLikeRepository } from '../repositories/lecturer-like.repository';

@Injectable()
export class LecturerLikeService {
  constructor(
    private readonly lecturerLikeRepository: LecturerLikeRepository,
  ) {}

  async createLecturerLike(lecturerId: number, userId: number) {
    return await this.lecturerLikeRepository.createLecturerLike(
      lecturerId,
      userId,
    );
  }

  async deleteLecturerLike(lecturerId: number, userId: number) {
    return await this.lecturerLikeRepository.deleteLecturerLike(
      lecturerId,
      userId,
    );
  }

  async readManyLecturerLike(userId: number) {
    const lecturerLike = await this.lecturerLikeRepository.readManyLecturerLike(
      userId,
    );
    const count = await this.lecturerLikeRepository.getCountLecturerLike(
      userId,
    );

    return { count, lecturerLike };
  }
}
