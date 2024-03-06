import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseReturnWithSwaggerDto {
  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @Expose()
  updatedAt: Date;
}
