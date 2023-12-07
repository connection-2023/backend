import { ReportType, UserReportType } from '@prisma/client';
import { ReportTypeDto } from './report-type.dot';
import { ApiProperty } from '@nestjs/swagger';

export class UserReportTypeDto implements UserReportType {
  id: number;
  reportId: number;
  reportTypeId: number;

  @ApiProperty({
    description: '신고 유형',
    type: ReportTypeDto,
  })
  reportType: ReportTypeDto;
  constructor(reportType: Partial<UserReportTypeDto>) {
    this.reportType = reportType.reportType
      ? new ReportTypeDto(reportType.reportType)
      : null;

    Object.seal(this);
  }
}
