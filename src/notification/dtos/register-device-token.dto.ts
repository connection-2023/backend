import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceTokenDto {
  @ApiProperty({ description: 'token 값', required: true })
  @IsNotEmpty()
  @IsString()
  deviceToken: string;
}
