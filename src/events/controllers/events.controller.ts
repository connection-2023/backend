import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './../services/events.service';
import { Controller, Get, Query } from '@nestjs/common';
import { GetOnlineMapWithTargetQueryDto } from '../dtos/request/get-online-map-with-target.query.dto';
import { ApiEvents } from './swagger/events.swagger';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiEvents.GetOnlineMapWithTargetId({ summary: '상대 id로 현활 조회' })
  @SetResponseKey('onlineMap')
  @Get('online-map')
  async getOnlineMapWithTargetId(
    @Query() target: GetOnlineMapWithTargetQueryDto,
  ) {
    return await this.eventsService.getOnlineMapWithTargetId(target);
  }
}
