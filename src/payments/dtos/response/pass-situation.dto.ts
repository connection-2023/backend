import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class PassSituationReservationDto extends OmitType(ReservationDto, [
  'lectureSchedule',
  'regularLectureStatus',
]) {
  @ApiProperty({
    type: SimpleLectureDto,
    description: '사용한 강의 정보',
  })
  @Expose()
  lecture: SimpleLectureDto;

  constructor(reservation: Partial<PassSituationReservationDto>) {
    super();

    Object.assign(this, reservation);

    this.lecture = new SimpleLectureDto(reservation.lecture);
  }
}

@Exclude()
class PassSituationUserPassDto extends PickType(UserPassDto, [
  'id',
  'remainingUses',
  'startAt',
  'endAt',
]) {
  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @Expose()
  updatedAt: Date;

  constructor(userPass: Partial<PassSituationUserPassDto>) {
    super();

    Object.assign(this, userPass);
  }
}

@Exclude()
class PassSituationUserDto extends PickType(UserDto, ['id', 'nickname']) {
  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  userProfileImageUrl?: string;

  userProfileImage: UserProfileImageDto;

  constructor(user: Partial<PassSituationUserDto>) {
    super();

    Object.assign(this, user);

    this.userProfileImageUrl = user.userProfileImage
      ? user.userProfileImage.imageUrl
      : null;
  }
}

@Exclude()
export class PassSituationDto {
  @ApiProperty({
    type: PassSituationUserDto,
    description: '유저 정보',
  })
  @Expose()
  user: PassSituationUserDto;

  @ApiProperty({
    type: PassSituationUserPassDto,
    description: '패스권 정보',
  })
  @Expose()
  userPass: PassSituationUserPassDto;

  @ApiProperty({
    type: [PassSituationReservationDto],
    description: '예약 정보',
    nullable: true,
  })
  @Expose()
  reservations?: PassSituationReservationDto[];

  constructor(passSituation: Partial<PassSituationDto>) {
    Object.assign(this, passSituation);

    this.user = new PassSituationUserDto(passSituation.user);
    this.userPass = new PassSituationUserPassDto(passSituation.userPass);
    this.reservations =
      passSituation.reservations && passSituation.reservations[0]
        ? passSituation.reservations.map(
            (reservation) => new PassSituationReservationDto(reservation),
          )
        : null;
  }
}
