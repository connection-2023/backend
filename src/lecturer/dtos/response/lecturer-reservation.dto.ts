import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { SimpleLectureDto } from '../simple-lecture.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserWithProfileImageDto } from '@src/common/dtos/user-with-profile-image.dto';
import { PaymentLectureScheduleDto } from '@src/payments/dtos/payment-lecture-schedule.dto';
import { PaymentRegularLectureStatusDto } from '@src/payments/dtos/payment-regular-lecture-status.dto';

class LecturerReservationOneDayScheduleDto extends OmitType(
  PaymentLectureScheduleDto,
  ['lecture'],
) {}

class LecturerReservationRegularLectureStatusDto extends OmitType(
  PaymentRegularLectureStatusDto,
  ['lecture'],
) {}

@Exclude()
export class LecturerReservationDto extends ReservationDto {
  @ApiProperty({
    type: SimpleLectureDto,
    description: '강의 정보',
  })
  @Type(() => SimpleLectureDto)
  @Expose()
  lecture: SimpleLectureDto;

  @ApiProperty({
    type: UserWithProfileImageDto,
    description: '신청자 정보',
  })
  @Transform(({ value }) => new UserWithProfileImageDto(value))
  @Expose()
  user: UserWithProfileImageDto;

  @ApiProperty({
    type: LecturerReservationOneDayScheduleDto,
    description: '원데이 스케쥴 정보',
  })
  @Type(() => LecturerReservationOneDayScheduleDto)
  @Expose()
  lectureSchedule?: LecturerReservationOneDayScheduleDto;

  @ApiProperty({
    type: LecturerReservationRegularLectureStatusDto,
    description: '정규 스케쥴 정보',
  })
  @Type(() => LecturerReservationRegularLectureStatusDto)
  @Expose()
  regularLectureStatus?: LecturerReservationRegularLectureStatusDto;
}
