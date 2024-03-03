import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IssuedPassFilterOptions, PassStatusOptions } from '../enum/pass.enum';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class GetMyIssuedPassListDto extends PaginationDto {
  @ApiProperty({
    example: 'AVAILABLE',
    description: 'AVAILABLE, DISABLED 중 하나',
    required: true,
  })
  @IsEnum(PassStatusOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  passStatusOptions: PassStatusOptions;

  @ApiProperty({
    enum: IssuedPassFilterOptions,
    required: true,
  })
  @IsEnum(IssuedPassFilterOptions, { each: true })
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  filterOption: IssuedPassFilterOptions;

  @ApiProperty({
    type: Number,
    description: '원하는 클래스 ID',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  lectureId: number;
}
