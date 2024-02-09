import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

@Exclude()
export class BasicUserDto implements Pick<Users, 'id' | 'nickname'> {
  id: number;
  nickname: string;
}
