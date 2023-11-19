import { Module } from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LecturerController } from '@src/lecturer/controllers/lecturer.controller';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CustomElasticSearchModule } from '@src/common/config/search-module.config';

@Module({
  imports: [CustomElasticSearchModule],
  providers: [LecturerService, LecturerRepository],
  exports: [LecturerRepository],
  controllers: [LecturerController],
})
export class LecturerModule {}
