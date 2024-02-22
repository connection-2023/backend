import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotBlank,
  IsNumberType,
} from '@src/common/validator/custom-validator';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';

export class GetCombinedSearchResultDto {
  @ApiProperty({
    description: '검색어',
    required: true,
  })
  @IsNotBlank()
  value: string;

  @ApiProperty({
    description: '조회할 개수',
    required: true,
  })
  @IsNumberType()
  take: number;

  // @ApiProperty({
  //   description: '강의 마지막 아이템의 searchAfter',
  //   required: false,
  // })
  // @ArrayMinSize(1)
  // @Transform(({ value }) => value.map(Number))
  // @IsArray()
  // @IsOptional()
  // lectureSearchAfter: number[];

  // @ApiProperty({
  //   description: '강사 마지막 아이템의 searchAfter',
  //   required: false,
  // })
  // @ArrayMinSize(1)
  // @Transform(({ value }) => value.map(Number))
  // @IsArray()
  // @IsOptional()
  // lecturerSearchAfter: number[];
}
