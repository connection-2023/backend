import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaymentHistoryTypes } from '../enum/payment.enum';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { BadRequestException, Type as t } from '@nestjs/common';
import { TransformEnumValue } from '@src/common/utils/enum-value-extractor';

export class GetUserPaymentsHistoryDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentHistoryTypes),
    description: '결제 타입',
    required: true,
  })
  @Transform(({ value }) => TransformEnumValue(value, PaymentHistoryTypes))
  @IsNotEmpty()
  paymentHistoryType: PaymentHistoryTypes;
}
