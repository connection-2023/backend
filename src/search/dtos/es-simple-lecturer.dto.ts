import { ApiProperty } from '@nestjs/swagger';
import { EsSimpleLecturer } from '../interface/search.interface';

export class EsSimpleLecturerDto {
  @ApiProperty({
    type: Number,
    description: '강사Id',
  })
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  profileCardImageUrl: string;

  constructor(lecturer: Partial<EsSimpleLecturer>) {
    this.id = lecturer.lecturerId;
    this.nickname = lecturer.nickname;
    this.profileCardImageUrl = lecturer.profileCardImageUrl;

    Object.assign(this);
  }
}
