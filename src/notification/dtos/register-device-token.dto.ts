import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceType } from '../enum/notification.enum';

export class RegisterDeviceTokenDto {
  @ApiProperty({ description: 'token 값', required: true })
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  @ApiProperty({ description: 'device type', required: true, enum: DeviceType })
  @IsEnum(DeviceType, { each: true })
  @IsNotEmpty()
  @IsString()
  deviceType: DeviceType;
}
