import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateUserReportResponseDto {
  @ApiProperty({
    description: '신고 Id',
  })
  @IsNumberType()
  @IsNotEmpty()
  reportId: number;

  @ApiProperty({
    description: '답변 내용',
  })
  @IsNotEmpty()
  description: string;
}
