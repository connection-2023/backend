import { ApiProperty } from '@nestjs/swagger';
import { IEsRegion } from '../../interface/search.interface';
import { Exclude, Expose, Transform } from 'class-transformer';
@Exclude()
export class EsRegionDto {
  @ApiProperty({
    type: Number,
    description: '지역 Id',
  })
  @Expose()
  @Transform(({ obj }) => obj.regionId)
  id: number;

  @ApiProperty({
    description: '도/시',
  })
  @Expose()
  administrativeDistrict: string;

  @ApiProperty({
    description: '시/군/구',
  })
  @Expose()
  district: string;

  constructor(region: Partial<IEsRegion>) {
    Object.assign(this, region);
  }
}
