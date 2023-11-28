import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from '@src/common/validator/custom-validator';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateLecturePassDto {
  @ApiProperty({
    example: '손흥민의 날카로운 패스.',
    description: '패스권 이름',
    required: true,
  })
  @IsNotBlank()
  title: string;

  @ApiProperty({
    example: 10,
    description: '가격',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 10,
    description: '패스권 사용 개수',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  maxUsageCount: number;

  @ApiProperty({
    example: 3,
    description: '사용 가능 기간',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  availableMonths: number;

  @ApiProperty({
    example: [1, 2],
    description: '강의 Id 1개도 배열',
    required: true,
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  lectureIds: number[];
}
