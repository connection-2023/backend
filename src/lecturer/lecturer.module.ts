import { Module } from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LecturerController } from '@src/lecturer/controllers/lecturer.controller';
import { CustomElasticSearchModule } from '@src/common/config/search-module.config';
import { LecturerLikeController } from './controllers/lecturer-like.controller';
import { LecturerLikeService } from './services/lecturer-like.service';
import { LecturerLikeRepository } from './repositories/lecturer-like.repository';
import { LecturerBlockService } from './services/lecturer-block.service';
import { LecturerBlockRepository } from './repositories/lecturer-block.repository';
import { LecturerBlockController } from './controllers/lecturer-block.controller';
import { PopularLecturerService } from './services/popular-lecturer.service';
import { PopularLecturerRepository } from './repositories/popular-lecturer.repository';
import { PopularLecturerController } from './controllers/popular-lecturer.controller';
import { LectureLikeRepository } from '@src/lecture/repositories/lecture-like.repository';
import { ChatRoomRepository } from '@src/chats/repositories/chats-room.repository';
import { ChatsModule } from '@src/chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from '@src/chats/schemas/chats-room.schema';
import { Chats, ChatsSchema } from '@src/chats/schemas/chats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [
    LecturerService,
    LecturerRepository,
    LecturerLikeService,
    LecturerLikeRepository,
    LecturerBlockService,
    LecturerBlockRepository,
    PopularLecturerService,
    PopularLecturerRepository,
    LectureLikeRepository,
    ChatRoomRepository,
  ],
  controllers: [
    LecturerController,
    LecturerLikeController,
    LecturerBlockController,
    PopularLecturerController,
  ],
})
export class LecturerModule {}
