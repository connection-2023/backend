import { EventsRepository } from './../repositories/events.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnlineMapDto } from '@src/common/dtos/online-map.dto';
import { GetOnlineMapWithTargetQueryDto } from '../dtos/request/get-online-map-with-target.query.dto';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async getOnlineMapWithTargetId(target: GetOnlineMapWithTargetQueryDto) {
    const online = await this.eventsRepository.getOnlineMapWithTargetId(target);

    if (!online) {
      throw new NotFoundException(
        `Not found for user id: ${target.userId}, lecturer id: ${target.lecturerId}`,
      );
    }

    return new OnlineMapDto(online);
  }
}
