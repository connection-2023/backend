import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { UserDeviceTokenToDeviceTypeDto } from './user-device-token-to-device-type.dto';

@Exclude()
export class UserDeviceTokenDto {
  @Expose()
  @ApiProperty({ description: 'token id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'user id', type: Number })
  @Type(() => Number)
  userId: number;

  @Expose()
  @ApiProperty({ description: 'device token' })
  deviceToken: string;

  @Expose()
  @ApiProperty({
    description: 'device type',
    type: [UserDeviceTokenToDeviceTypeDto],
  })
  @Type(() => UserDeviceTokenToDeviceTypeDto)
  userDeviceTokenToDeviceType?: UserDeviceTokenToDeviceTypeDto[];

  @Expose()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  users?: UserDto;

  constructor(userDeviceTokenDto: UserDeviceTokenDto) {
    Object.assign(this, userDeviceTokenDto);
  }
}
