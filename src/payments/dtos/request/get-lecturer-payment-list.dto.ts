import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/dtos/pagination.dto';
import { ExtractEnumKeys } from '@src/common/utils/enum-key-extractor';
import { TransformEnumValue } from '@src/common/utils/enum-value-extractor';
import { PaymentHistoryTypes } from '@src/payments/enum/payment.enum';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty } from 'class-validator';

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
  endDate: string;

  @ApiProperty({
    enum: ExtractEnumKeys(PaymentHistoryTypes),
    description: '조회 기간 ~ endDate',
  })
  @Transform(({ value }) =>
    TransformEnumValue(value, PaymentHistoryTypes, 'productType'),
  )
  @IsNotEmpty()
  productType: PaymentHistoryTypes;

  constructor() {
    super();
  }
}
