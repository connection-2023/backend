import { ApiProperty } from '@nestjs/swagger';
import { Region } from '@prisma/client';

export class RegionDto implements Region {
  id: number;

  @ApiProperty({
    description: '도/시',
  })
  administrativeDistrict: string;

  @ApiProperty({
    description: '시/군/구',
  })
  district: string;

  constructor(region: Partial<RegionDto>) {
    this.administrativeDistrict = region.administrativeDistrict;
    this.district = region.district;

    Object.assign(this);
  }
}
