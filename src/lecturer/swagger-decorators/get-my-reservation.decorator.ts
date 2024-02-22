import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturerReservationDto } from '../dtos/response/lecturer-reservation.dto';

export function ApiGetMyReservationList() {
  return applyDecorators(
    ApiOperation({
      summary: ' 최근 신청 내역 조회 ',
    }),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'myReservationList',
      LecturerReservationDto,
      {
        isArray: true,
      },
    ),
  );
}
