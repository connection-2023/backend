import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, [
    'name',
    'nickname',
    'email',
    'phoneNumber',
    'provider',
    'authEmail',
  ] as const),
) {
  @ApiPropertyOptional({
    example: 'image url',
    description: '변경한 s3 이미지 url',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
