import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollScheduleDetailQueryDto {
  @ApiProperty({
    example: '원데이',
    description: '원데이/정기',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}
