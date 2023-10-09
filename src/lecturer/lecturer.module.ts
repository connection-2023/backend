import { Module } from '@nestjs/common';
import { LecturerController } from './controllers/lecturer.controller';
import { LecturerService } from './services/lecturer.service';
import { LecturerRepository } from './repositories/lecturer.repository';
import { RegionModule } from '@src/region/region.module';

@Module({
  imports: [RegionModule],
  providers: [LecturerService, LecturerRepository],
  controllers: [LecturerController],
})
export class LecturerModule {}
