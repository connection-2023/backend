import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class GetOnlineMapWithTargetQueryDto {
  @ApiProperty({ description: '유저 id', required: false })
  @IsNumberType()
  @IsNotEmpty()
  @ValidateIf(({ lecturerId }) => !lecturerId)
  userId?: number;

  @ApiProperty({ description: '강사 id', required: false })
  @IsNumberType()
  @IsNotEmpty()
  @ValidateIf(({ userId }) => !userId)
  lecturerId?: number;
}
