import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';
import { ReportTypes } from '@src/report/eunm/report-enum';

export class ReportTypeDto implements ReportType {
  id: number;

  @ApiProperty({
    description: '관리자 답변',
    enum: ReportTypes,
  })
  name: string;

  @ApiProperty({
    example: '저작권 불법 도용',
    description: '신고 유형에 대한 설명',
  })
  description: string;

  constructor(reportType: Partial<ReportTypeDto>) {
    this.name = reportType.name;
    this.description = reportType.description;

    Object.seal(this);
  }
}
