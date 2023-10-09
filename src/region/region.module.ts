import { Module } from '@nestjs/common';
import { RegionRepository } from './repository/region.repository';

@Module({
  providers: [RegionRepository],
  exports: [RegionRepository],
})
export class RegionModule {}
