import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { AdminDto } from './admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LecturerReportResponse, UserReportResponse } from '@prisma/client';

export class ReportResponseDto
  extends BaseReturnDto
  implements UserReportResponse, LecturerReportResponse
{
  @ApiProperty({
    type: Number,
  })
  id: number;
  reportId: number;
  adminId: number;

  @ApiProperty({
    description: '답변 내용',
  })
  description: string;
  deletedAt: Date;

  @ApiProperty({
    description: '관리자 정보',
    type: AdminDto,
  })
  admin: AdminDto;

  constructor(reportResponse: ReportResponseDto) {
    super();

    this.id = reportResponse.id;
    this.description = reportResponse.description;
    this.createdAt = reportResponse.createdAt;
    this.updatedAt = reportResponse.updatedAt;

    if (reportResponse.admin) {
      this.admin = new AdminDto(reportResponse.admin);
    }

    Object.seal(this);
  }
}
