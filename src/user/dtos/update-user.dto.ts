import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, [
    'name',
    'nickname',
    'email',
    'phoneNumber',
    'provider',
    'authEmail',
  ] as const),
) {}
