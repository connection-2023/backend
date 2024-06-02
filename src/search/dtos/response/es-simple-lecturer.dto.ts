import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class EsSimpleLecturerDto {
  @ApiProperty({
    type: Number,
    description: '강사Id',
  })
  @Transform(({ obj }) => obj.lecturerId, { toClassOnly: true })
  @Expose()
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Transform(({ obj }) => obj.nickname, { toClassOnly: true })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Transform(({ obj }) => obj.profileCardImageUrl, { toClassOnly: true })
  @Expose()
  profileCardImageUrl: string;
}
