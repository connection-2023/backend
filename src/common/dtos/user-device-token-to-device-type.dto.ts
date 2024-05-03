import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDeviceTokenToDeviceTypeDto {
  @Expose()
  @ApiProperty({ description: 'id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: 'type' })
  type: string;

  constructor(userDeviceTokenToDeviceType: UserDeviceTokenToDeviceTypeDto) {
    Object.assign(this, userDeviceTokenToDeviceType);
  }
}
