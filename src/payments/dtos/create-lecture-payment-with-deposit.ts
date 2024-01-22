import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ILectureSchedule } from '@src/payments/interface/payments.interface';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerLectureScheduleDto } from '@src/payments/swagger-dtos/lecture-schedule';
import { IsNumberType } from '@src/common/validator/custom-validator';

export class CreateLecturePaymentWithDepositDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  lectureId: number;

  @ApiProperty({
    description: '주문명',
    required: true,
  })
  @IsNotEmpty()
  orderName: string;

  @ApiProperty({
    description: '주문Id UUID',
    required: true,
  })
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    type: SwaggerLectureScheduleDto,
    description: '강의스케쥴',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => SwaggerLectureScheduleDto)
  @IsNotEmpty()
  lectureSchedule: ILectureSchedule;

  @ApiProperty({
    type: Number,
    description: '보증금',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  noShowDeposit: number;

  @ApiProperty({
    type: Number,
    description: '할인 적용 전 금액',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  originalPrice: number;

  @ApiProperty({
    type: Number,
    description: '최종 결제 금액',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  finalPrice: number;

  @ApiProperty({
    description: '입금자명',
    required: true,
  })
  @IsNotEmpty()
  senderName: string;

  @ApiProperty({
    type: Number,
    description: '환불할 유저 계좌 Id ',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  userBankAccountId: number;

  @ApiProperty({
    description: '대표자 이름',
    required: true,
  })
  @IsNotEmpty()
  representative: string;

  @ApiProperty({
    example: '01022224444',
    description: '대표자 전화 번호',
    required: true,
  })
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: '요청사항',
    required: false,
  })
  @IsOptional()
  requests: string;
}
