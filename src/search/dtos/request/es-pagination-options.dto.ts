import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class EsPaginationOptionsDto {
  @ApiProperty({
    type: Number,
    description: '조회할 개수',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @Length(1, 50, { message: '검색어의 길이는 1에서 50 사이여야 합니다.' })
  @IsString()
  @IsOptional()
  value: string;

  @ApiProperty({
    type: [Number],
    description: '마지막 아이템의 searchAfter',
    required: false,
  })
  @ArrayMinSize(1)
  @Transform(({ value }) => value.map(Number))
  @IsArray()
  @IsOptional()
  searchAfter: number[];
}
