import { LectureToRegion } from '@prisma/client';
import { RegionDto } from './region.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LectureToRegionDto implements LectureToRegion {
  id: number;
  regionId: number;
  lectureId: number;

  @ApiProperty({
    description: '지역',
    type: RegionDto,
  })
  region: RegionDto;

  constructor(lectureRegion: Partial<LectureToRegionDto>) {
    this.region = lectureRegion.region
      ? new RegionDto(lectureRegion.region)
      : null;

    Object.assign(this);
  }
}
