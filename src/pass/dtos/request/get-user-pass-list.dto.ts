import { PickType } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/dtos/pagination.dto';

export class GetUserPassListDto extends PickType(PaginationDto, [
  'take',
  'lastItemId',
]) {}
