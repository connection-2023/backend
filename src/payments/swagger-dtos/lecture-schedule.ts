import { ApiProperty } from '@nestjs/swagger';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { ILectureSchedule } from '@src/payments/interface/payments.interface';

export class SwaggerLectureScheduleDto {
  id?: number;

  @ApiProperty({ description: '강의 스케쥴의 아이디', required: true })
  @IsNumberType()
  lectureScheduleId: number;

  @ApiProperty({ description: '참가자 수', required: true })
  @IsNumberType()
  participants: number;
}
