import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@src/user/user.module';
import { LectureModule } from '@src/lecture/lecture.module';
import { PrismaModule } from '@src/prisma/prisma.module';

@Module({
  imports: [UserModule, LectureModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
