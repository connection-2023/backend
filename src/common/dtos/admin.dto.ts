import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '@prisma/client';

export class AdminDto implements Admin {
  @ApiProperty({
    description: '관리자 id',
    type: Number,
  })
  id: number;
  name: string;

  @ApiProperty({
    description: '관리자 닉네임',
  })
  nickname: string;
  email: string;

  @ApiProperty({
    description: '관리자 프로필 이미지',
    nullable: true,
  })
  profileImage: string | null;

  constructor(admin: Admin) {
    this.id = admin.id;
    this.nickname = admin.nickname;
    this.profileImage = admin.profileImage;

    Object.seal(this);
  }
}
