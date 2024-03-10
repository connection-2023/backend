import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { LegacyReservationDto } from '@src/common/dtos/legacy-reservation.dto';
import { ReservationWithLectureDto } from '@src/common/dtos/reservation-with-lecture.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';
import { UserProfileImageDto } from '@src/common/dtos/user-profile-image.dto';
import { UserDto } from '@src/common/dtos/user.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

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
  @Transform(
    ({ obj }) => (obj.userProfileImageUrl ? obj.userProfileImageUrl : null),
    { toPlainOnly: true },
  )
  @Expose()
  userProfileImageUrl?: string | null;

  userProfileImage: UserProfileImageDto;

  constructor(user: Partial<PassSituationUserDto>) {
    super();

    Object.assign(this, user);
  }
}

@Exclude()
export class PassSituationDto {
  @ApiProperty({
    type: PassSituationUserDto,
    description: '유저 정보',
  })
  @Type(() => PassSituationUserDto)
  @Expose()
  user: PassSituationUserDto;

  @ApiProperty({
    type: PassSituationUserPassDto,
    description: '패스권 정보',
  })
  @Type(() => PassSituationUserPassDto)
  @Expose()
  userPass: PassSituationUserPassDto;

  @ApiProperty({
    type: [ReservationWithLectureDto],
    description: '예약 정보',
    nullable: true,
  })
  @Type(() => ReservationWithLectureDto)
  @Expose()
  reservations?: ReservationWithLectureDto[];

  constructor(passSituation: Partial<PassSituationDto>) {
    Object.assign(this, passSituation);
  }
}
