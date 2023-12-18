import { Injectable } from '@nestjs/common';
import { LecturerBlockRepository } from '../repositories/lecturer-block.repository';

@Injectable()
export class LecturerBlockService {
  constructor(
    private readonly lecturerBlockRepository: LecturerBlockRepository,
  ) {}

  async createLecturerBlock(lecturerId: number, userId: number) {
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
