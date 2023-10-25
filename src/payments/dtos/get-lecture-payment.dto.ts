import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { LectureSchedule } from '../interface/payments.interface';
import { PaymentMethods } from '../enum/payment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetLecturePaymentDto {
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
    example: [
      {
        lectureScheduleId: 1,
        participants: 4,
      },
    ],
    description: '강의스케쥴, 인원수 배열| 여러 스케쥴 결제 가능',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  lectureSchedules: LectureSchedule[];

  @ApiProperty({
    example: 10000,
    description: '결제 금액',
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 1,
    description: '일반 쿠폰 Id',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  couponId: number;

  @ApiProperty({
    example: 1,
    description: '중복쿠폰 Id',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  stackableCouponId: number;

  @ApiProperty({
    example: '카드 or 가상계좌',
    description: '결제방식',
    required: true,
  })
  @IsEnum(PaymentMethods)
  @IsNotEmpty()
  method: PaymentMethods;

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
