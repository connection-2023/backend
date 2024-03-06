import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { BasicLectureDto } from '@src/common/dtos/basic-lecture.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { PaymentLectureScheduleWithLectureDto } from '@src/payments/dtos/payment-lecture-schedule.dto';
import { PaymentDto } from '@src/payments/dtos/payment.dto';
import { Exclude, Expose, Type } from 'class-transformer';
@Exclude()
class PassReservationPaymentDto extends PickType(PaymentDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@Exclude()
class PassReservationLectureScheduleDto extends OmitType(
  PaymentLectureScheduleWithLectureDto,
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
export class PassReservationDto extends OmitType(ReservationDto, [
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
