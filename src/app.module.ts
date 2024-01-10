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
import { CustomJwtModule } from '@src/common/config/jwt-module.cofig';
import { UploadsModule } from '@src/uploads/uploads.module';
import { CouponModule } from '@src/coupon/coupon.module';
import { PaymentsModule } from '@src/payments/payments.module';
import { TestModule } from '@src/apiTest/test.module';
import { PassModule } from '@src/pass/pass.module';
import { ReportModule } from '@src/report/report.module';
import { AdminModule } from './admin/admin.module';
import { SuccessInterceptorModule } from './common/interceptors/success-interceptor.module';
import { SearchModule } from './search/search.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    LectureModule,
    PrismaModule,
    LecturerModule,
    AuthModule,
    CustomJwtModule,
    CustomCacheModule,
    PaymentsModule,
    CouponModule,
    CustomConfigModule,
    UploadsModule,
    TestModule,
    PaymentsModule,
    PassModule,
    ReportModule,
    AdminModule,
    SuccessInterceptorModule,
    SearchModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, EventsGateway],
})
export class AppModule {}
