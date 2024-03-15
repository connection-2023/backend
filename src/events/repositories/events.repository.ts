import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnlineMap } from '../schemas/online-map.schema';
import { Model } from 'mongoose';
import { GetOnlineMapWithTargetQueryDto } from '../dtos/request/get-online-map-with-target.query.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(OnlineMap.name)
    private readonly onlineMapModel: Model<OnlineMap>,
  ) {}

  async getOnlineMapWithTargetId(
    target: GetOnlineMapWithTargetQueryDto,
  ): Promise<OnlineMap> {
    return await this.onlineMapModel.findOne(target).exec();
  }
}
