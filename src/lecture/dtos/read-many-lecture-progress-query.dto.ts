import { ApiProperty } from '@nestjs/swagger';
import { LectureProgressType } from '@src/common/enum/enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ReadManyLectureProgressQueryDto {
  @ApiProperty({
    example: '진행중',
    description: '진행중,마감된 클래스',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(LectureProgressType, { each: true })
  progressType: LectureProgressType;
}
