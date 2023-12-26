import { LecturerRegion } from '@prisma/client';
import { RegionDto } from './region.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LecturerRegionDto implements LecturerRegion {
  id: number;
  regionId: number;
  lecturerId: number;

  @ApiProperty({
    description: '지역',
    type: RegionDto,
  })
  region: RegionDto;

  constructor(lecturerRegion: Partial<LecturerRegionDto>) {
    this.region = lecturerRegion.region
      ? new RegionDto(lecturerRegion.region)
      : null;

    Object.assign(this);
  }
}
