import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 1, description: '지역id', required: true })
  @IsNumber()
  regionId: number;

  @ApiProperty({ example: '이재현', description: '이름', required: true })
  @IsString()
  name: string;

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
  isProfileOpen: boolean;

  @ApiProperty({
    example: '01012345678',
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
    description: '사용 이메일',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'KAKAO',
    description: '가입방식',
    required: true,
  })
  @IsString()
  provider: string;

  @ApiProperty({
    example: 'test@test.com',
    description: '소셜 이메일',
    required: true,
  })
  @IsEmail()
  authEmail: string;
}
