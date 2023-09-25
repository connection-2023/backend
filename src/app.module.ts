import { Module } from '@nestjs/common';
import { LecturerModule } from './lecturer/lecturer.module';
import { AuthModule } from './auth/auth.module';
import { CustomConfigModule } from './common/config/config-module.config';
import { CustomCacheModule } from './common/config/cache-module.config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@src/user/user.module';
import { LectureModule } from '@src/lecture/lecture.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LectureModule,
    PrismaModule,
    LecturerModule,
    AuthModule,
    CustomConfigModule,
    CustomCacheModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
