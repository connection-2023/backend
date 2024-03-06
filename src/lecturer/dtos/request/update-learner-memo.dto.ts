import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateLearnerMemoDto {
  @ApiProperty({
    description: '내용을 지울때 null또는 빈 문자열',
    nullable: true,
  })
  @IsOptional()
  memo: string;
}
