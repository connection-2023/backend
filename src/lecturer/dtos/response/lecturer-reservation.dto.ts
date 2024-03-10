import { LegacyReservationDto } from '@src/common/dtos/legacy-reservation.dto';
import { SimpleLectureDto } from '../simple-lecture.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserWithProfileImageDto } from '@src/common/dtos/user-with-profile-image.dto';
import { LegacyPaymentLectureScheduleWithLectureDto } from '@src/payments/dtos/legacy-payment-lecture-schedule.dto';
import { PaymentRegularLectureStatusDto } from '@src/payments/dtos/payment-regular-lecture-status.dto';
@Exclude()
class LecturerReservationOneDayScheduleDto extends OmitType(
  LegacyPaymentLectureScheduleWithLectureDto,
  ['lecture'],
) {}
@Exclude()
class LecturerReservationRegularLectureStatusDto extends OmitType(
  PaymentRegularLectureStatusDto,
  ['lecture'],
) {}
@Exclude()
class LecturerReservationLectureDto extends SimpleLectureDto {
  @ApiProperty({
    type: Number,
    description: '최대 수강생',
  })
  @Expose()
  maxCapacity: number;
}

@Exclude()
export class LecturerReservationDto extends LegacyReservationDto {
  @ApiProperty({
    type: LecturerReservationLectureDto,
    description: '강의 정보',
  })
  @Type(() => LecturerReservationLectureDto)
  @Expose()
  lecture: LecturerReservationLectureDto;

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
