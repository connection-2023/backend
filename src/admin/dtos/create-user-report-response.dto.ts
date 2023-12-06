import { IsNumberType } from '@src/common/validator/custom-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateUserReportResponseDto {
  @IsNumberType()
  @IsNotEmpty()
  reportId: number;

  @IsNotEmpty()
  description: string;
}
