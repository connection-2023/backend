import { LecturerReportResponse, UserReportResponse } from '@prisma/client';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { AdminDto } from './admin.dto';

export class ReportResponseDto
  extends BaseReturnDto
  implements UserReportResponse, LecturerReportResponse
{
  id: number;
  reportId: number;
  adminId: number;
  description: string;
  deletedAt: Date;

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
