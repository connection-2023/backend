import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ReportType } from '../eunm/report-enum';

export class CreateUserReportDto {
  @IsOptional()
  targetUserId: number;

  @IsOptional()
  targetLecturerId: number;

  @IsOptional()
  targetReviewId: number;

  @IsEnum(ReportType)
  reportType: ReportType;

  @IsNotEmpty()
  reason: string;
}
