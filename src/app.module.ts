import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [UserModule, LectureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
