import { ApiProperty } from '@nestjs/swagger';

export class BaseReturnWithSwaggerDto {
  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  updatedAt: Date;
}
