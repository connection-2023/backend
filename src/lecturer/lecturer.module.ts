import { Module } from '@nestjs/common';
import { LecturerController } from '@src/lecturer/controllers/lecturer.controller';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';

@Module({
  providers: [LecturerService, LecturerRepository],
  controllers: [LecturerController],
})
export class LecturerModule {}
