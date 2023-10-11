import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAuthDto {
  @ApiProperty({ example: 1, description: '생성한 userId', required: true })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'illppang@naver.com',
    description: '이메일 / 이메일 형식이 아니면 에러 반환',
    required: true,
  })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'authEmail: 잘못된 이메일 형식입니다.',
  })
  @IsNotEmpty()
  authEmail: string;

  @ApiProperty({
    example: 'KAKAO',
    description: '반환받은 signUpType',
    required: true,
  })
  @IsNotEmpty()
  signUpType: string;
}
