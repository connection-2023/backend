import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { PrivateUserProfileDto } from '../dtos/private-user-profile.dto';

export function ApiGetUserMyProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 내 프로필 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'myProfile',
      PrivateUserProfileDto,
    ),
  );
}
