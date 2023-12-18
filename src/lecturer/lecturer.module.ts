import { Module } from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LecturerController } from '@src/lecturer/controllers/lecturer.controller';
import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { CustomElasticSearchModule } from '@src/common/config/search-module.config';
import { LecturerLikeController } from './controllers/lecturer-like.controller';
import { LecturerLikeService } from './services/lecturer-like.service';
import { LecturerLikeRepository } from './repositories/lecturer-like.repository';
import { LecturerBlockService } from './services/lecturer-block.service';
import { LecturerBlockRepository } from './repositories/lecturer-block.repository';
import { LecturerBlockController } from './controllers/lecturer-block.controller';

@Module({
  // imports: [CustomElasticSearchModule],
  providers: [
    LecturerService,
    LecturerRepository,
    LecturerLikeService,
    LecturerLikeRepository,
    LecturerBlockService,
    LecturerBlockRepository,
  ],
  exports: [LecturerRepository],
  controllers: [
    LecturerController,
    LecturerLikeController,
    LecturerBlockController,
  ],
})
export class LecturerModule {}
