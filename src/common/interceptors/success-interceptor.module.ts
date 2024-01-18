import { Module } from '@nestjs/common';
import { SuccessInterceptor } from '@src/common/interceptors/success.interceptor';

@Module({
  providers: [SuccessInterceptor],
})
export class SuccessInterceptorModule {}
