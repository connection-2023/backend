import { ApiProperty } from '@nestjs/swagger';
import { IEsRegion } from '../../interface/search.interface';

export class EsRegionDto {
  @ApiProperty({
    type: Number,
    description: '지역 Id',
  })
  id: number;

  @ApiProperty({
    description: '도/시',
  })
  administrativeDistrict: string;

  @ApiProperty({
    description: '시/군/구',
  })
  district: string;

  constructor(region: Partial<IEsRegion>) {
    this.id = region.regionId;
    this.administrativeDistrict = region.administrativeDistrict;
    this.district = region.district;

    Object.assign(region);
  }
}
