import { ApiProperty } from '@nestjs/swagger';
import { BankEnum } from '@src/common/enum/enum';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { PaymentStatusForLecturer } from '../constants/enum';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { Transform } from 'class-transformer';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { BadRequestException } from '@nestjs/common';

const getPaymentStatusForLecturer = (key: string): PaymentStatusForLecturer => {
  const enumValue =
    PaymentStatusForLecturer[
      key.toUpperCase() as keyof typeof PaymentStatusForLecturer
    ];
  if (enumValue === undefined) {
    throw new BadRequestException(`Invalid status: ${key}`);
  }

  return enumValue;
};

export class UpdatePaymentRequestStatusDto {
  @ApiProperty({
    type: Number,
    description: 'payment Id',
    required: true,
  })
  @IsNumberType()
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentStatusForLecturer),
    description: '주문 상태',
    required: true,
  })
  @Transform(({ value }) => getPaymentStatusForLecturer(value))
  @IsNotEmpty()
  status: PaymentStatusForLecturer;

  @ApiProperty({
    description: '환불 금액 / REFUSED일때 필수',
    required: false,
  })
  @ValidateIf(({ status }) => status === PaymentStatusForLecturer.REFUSED)
  @IsNotEmpty()
  cancelAmount: number;

  @ApiProperty({
    description: '거절 이유 / REFUSED일때 필수',
    required: false,
  })
  @ValidateIf(({ status }) => status === PaymentStatusForLecturer.REFUSED)
  @IsNotEmpty()
  refusedReason: string;

  @ApiProperty({
    type: Number,
    description: '강의 id / WAITING_FOR_DEPOSIT일때 필수',
    required: false,
  })
  @IsNumberType()
  @ValidateIf(
    ({ status }) => status === PaymentStatusForLecturer.WAITING_FOR_DEPOSIT,
  )
  @IsNotEmpty()
  lectureId: number;
}
