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
import { CustomJwtModule } from './common/config/jwt-module.cofig';
import { UploadsModule } from './uploads/uploads.module';
import { CouponModule } from './coupon/coupon.module';
import { PaymentsModule } from './payments/payments.module';
import { TestModule } from '@src/apiTest/test.module';
import { LectureCommentController } from './lecture-comment/lecture-comment.controller';
import { LectureCommentService } from './lecture-comment/lecture-comment.service';
import { LectureReviewController } from './lecture-review/lecture-review.controller';
import { LectureReviewService } from './lecture-review/lecture-review.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController, LectureCommentController, LectureReviewController],
  providers: [AppService, ConfigService, LectureCommentService, LectureReviewService],
})
export class AppModule {}
