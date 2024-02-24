import { PassSortOptions } from '@src/search/enum/search.enum';
import { EsPaginationOptionsDto } from './es-pagination-options.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class SearchPassListDto extends EsPaginationOptionsDto {
  @ApiProperty({
    description: '정렬 옵션',
    enum: PassSortOptions,
    required: true,
  })
  @IsEnum(PassSortOptions)
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  sortOption: PassSortOptions;
}
