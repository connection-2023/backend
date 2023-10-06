import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'hyun', description: '닉네임', required: true })
  @IsString()
  nickname: string;

  @ApiProperty({
    example: true,
    description: '프로필 오픈 여부',
    required: false,
    default: false,
  })
  @IsBoolean()
  isProfileOpen: number;

  @ApiProperty({
    example: '010-1234-5678',
    description: '핸드폰 번호',
    required: false,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: '용마산로 616',
    description: '상세주소',
    required: false,
  })
  @IsString()
  detailAddress: string;

  @ApiProperty({
    example: '0',
    description: '성별',
    required: false,
  })
  @IsNumber()
  gender: number;

  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'KAKAO',
    description: '가입방식',
    required: true,
  })
  provider: string;
}
