import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LectureModule } from './lecture/lecture.module';
import { PrismaModule } from './prisma/prisma.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { AuthModule } from './auth/auth.module';
import { CustomConfigModule } from './common/config/config-module.config';
import { CustomCacheModule } from './common/config/cache-module.config';
import { CustomJwtModule } from './common/config/jwt-module.cofig';

@Module({
  imports: [
    UserModule,
    LectureModule,
    PrismaModule,
    LecturerModule,
    AuthModule,
    CustomJwtModule,
    CustomCacheModule,
    CustomConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
