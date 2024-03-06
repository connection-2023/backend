import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { TransformEnumValue } from '@src/common/utils/enum-value-extractor';
import { IsNumberType } from '@src/common/validator/custom-validator';
import { PaymentHistoryTypes } from '@src/payments/enum/payment.enum';
import { IsEndDateAfterStartDate } from '@src/payments/validators/is-end-date-after-start-date.validator';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class GetLecturerPaymentListDto extends PaginationDto {
  @ApiProperty({
    type: Date,
    description: '조회 기간 startDate ~',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    type: Date,
    description: '조회 기간 ~ endDate',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsEndDateAfterStartDate()
  endDate: string;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentHistoryTypes),
    description: '상품 타입',
  })
  @Transform(({ value }) =>
    TransformEnumValue(value, PaymentHistoryTypes, 'productType'),
  )
  @IsEnum(PaymentHistoryTypes)
  @IsNotEmpty()
  productType: PaymentHistoryTypes;

  @ApiProperty({
    type: Number,
    description: '강의 Id',
    required: false,
  })
  @IsNumberType()
  @IsOptional()
  lectureId: number;

  constructor() {
    super();
  }
}
