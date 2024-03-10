import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { BasicLectureDto } from '@src/common/dtos/basic-lecture.dto';
import { LegacyReservationDto } from '@src/common/dtos/legacy-reservation.dto';
import { LegacyPaymentLectureScheduleWithLectureDto } from '@src/payments/dtos/legacy-payment-lecture-schedule.dto';
import { LegacyPaymentDto } from '@src/payments/dtos/legacy-payment.dto';
import { Exclude, Expose, Type } from 'class-transformer';
@Exclude()
class PassReservationPaymentDto extends PickType(LegacyPaymentDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@Exclude()
class PassReservationLectureScheduleDto extends OmitType(
  LegacyPaymentLectureScheduleWithLectureDto,
  ['lecture'],
) {
  @ApiProperty({
    type: BasicLectureDto,
    description: '강의 정보',
  })
  @Type(() => BasicLectureDto)
  @Expose()
  lecture: BasicLectureDto;
}

@Exclude()
export class PassReservationDto extends OmitType(LegacyReservationDto, [
  'regularLectureStatus',
  'lectureSchedule',
  'payment',
]) {
  @ApiProperty({
    type: PassReservationLectureScheduleDto,
    description: '예약 일정',
  })
  @Type(() => PassReservationLectureScheduleDto)
  @Expose()
  lectureSchedule: PassReservationLectureScheduleDto;

  @ApiProperty({
    type: PassReservationPaymentDto,
    description: '결제 정보',
  })
  @Type(() => PassReservationPaymentDto)
  @Expose()
  payment: PassReservationPaymentDto;
}
