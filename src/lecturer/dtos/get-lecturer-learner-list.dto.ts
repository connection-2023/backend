import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { FilterOptions, SortOptions } from '../enum/lecturer.enum';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class GetLecturerLearnerListDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiProperty({
    enum: SortOptions,
    required: true,
  })
  @IsEnum(SortOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  sortOption: SortOptions;

  @ApiProperty({
    enum: FilterOptions,
    required: true,
  })
  @IsEnum(FilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: FilterOptions;

  @ApiProperty({
    description: '강의 id',
    required: false,
    type: Number,
  })
  @IsNumberType()
  @IsOptional()
  lectureId: number;
}
