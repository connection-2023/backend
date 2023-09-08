import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LectureModule } from './lecture/lecture.module';
import { PrismaModule } from './prisma/prisma.module';
import { LecturerModule } from './lecturer/lecturer.module';

@Module({
  imports: [UserModule, LectureModule, PrismaModule, LecturerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
