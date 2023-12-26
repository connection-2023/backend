import { Module } from '@nestjs/common';
import { SearchService } from './services/search.service';
import { SearchController } from './controllers/search.controller';
import { SearchRepository } from './repository/search.repository';
import { CustomElasticSearchModule } from '@src/common/config/search-module.config';

@Module({
  imports: [CustomElasticSearchModule],
  providers: [SearchService, SearchRepository],
  controllers: [SearchController],
})
export class SearchModule {}
