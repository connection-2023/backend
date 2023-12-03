import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ReportTypes } from '../eunm/report-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'FALSE_INFORMATION',
    enum: ReportTypes,
    required: true,
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(ReportTypes, { each: true })
  reportType: ReportTypes;

  @ApiProperty({
    example: 1,
    description: '신고할 유저Id',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  targetUserId: number;

  @ApiProperty({
    example: 1,
    description: '신고할 강사Id',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  targetLecturerId: number;

  @ApiProperty({
    example: 1,
    description: '리뷰 신고 시 작성자 userId포함',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  lectureReviewId: number;

  @ApiProperty({
    example: 1,
    description: '리뷰 신고 시 작성자 userId포함',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  lecturerReviewId: number;

  @ApiProperty({
    example: '이 사람이 저 때렸어요',
    description: '리뷰 신고 시 포함',
    required: false,
  })
  @IsOptional()
  reason: string;
}
