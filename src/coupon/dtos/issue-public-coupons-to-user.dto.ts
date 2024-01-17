import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class IssuePublicCouponToUserDto {
  @ApiProperty({
    type: [Number],
    description: '쿠폰 Id배열',
    required: true,
  })
  @Transform(({ value }) => value.map(Number))
  @ArrayMinSize(1)
  @IsNotEmpty()
  couponIds: number[];
}
