import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ILectureSchedule } from '@src/payments/interface/payments.interface';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerLectureScheduleDto } from '../swagger-dtos/lecture-schedule';

export class CreateLecturePaymentWithPassDto {
  @ApiProperty({
    example: 1,
    description: '강의 Id',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  passId: number;

  @ApiProperty({
    example: 1,
    description: '강의 Id',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  lectureId: number;

  @ApiProperty({
    example: '단스강의',
    description: '주문명',
    required: true,
  })
  @IsNotEmpty()
  orderName: string;

  @ApiProperty({
    example: 'cc10dc81-d865-43e4-a0bd-24db45b316b5',
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
    example: 100000,
    description: '할인 적용 전 금액',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  originalPrice: number;

  @ApiProperty({
    example: 95000,
    description: '할인이 적용된 최종 결제 금액',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  finalPrice: number;

  @ApiProperty({
    example: '김현수',
    description: '대표자 이름',
    required: true,
  })
  @IsNotEmpty()
  representative: string;

  @ApiProperty({
    example: '01022224444',
    description: '대표 번호',
    required: true,
  })
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '밥 많이 주세요',
    description: '요청사항',
    required: false,
  })
  @IsOptional()
  requests: string;
}
