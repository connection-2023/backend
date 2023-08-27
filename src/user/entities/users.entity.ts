import { ApiProperty } from '@nestjs/swagger';

export class UsersEntity {
  @ApiProperty({
    description: '닉네임',
    example: 'ljh',
  })
  nickname: string;

  @ApiProperty({
    description: '프로필 공개 여부',
    example: 'true',
  })
  isProfileOpen: boolean;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
  })
  phoneNumber: string | null;

  @ApiProperty({
    description: '상세 주소',
    example: '??',
  })
  detailAddress: string | null;

  @ApiProperty({
    description: '성별',
    example: '1',
  })
  gender: number | null;
}
