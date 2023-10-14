import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '이재현', description: '이름', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'hyun', description: '닉네임', required: true })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: true,
    description: '프로필 오픈 여부',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isProfileOpen: boolean;

  @ApiProperty({
    example: '01012345678',
    description: '핸드폰 번호',
    required: true,
  })
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    example: '0',
    description: '성별',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  gender: number;

  @ApiProperty({
    example: 'illppang@naver.com',
    description: '이메일 / 이메일 형식이 아니면 에러 반환',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: '잘못된 이메일 형식입니다.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'KAKAO',
    description: '가입방식',
    required: true,
  })
  @IsString()
  @IsOptional()
  provider: string;

  @ApiProperty({
    example: 'illppang@naver.com',
    description: '소셜이메일 / 소셜이메일 형식이 아니면 에러 반환',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: '잘못된 이메일 형식입니다.',
  })
  @IsEmail()
  @IsNotEmpty()
  authEmail: string;
}
