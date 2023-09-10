import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const CustomConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  cache: true,
  validationSchema: Joi.object({
    SENS_URL: Joi.string().required(),
    SENS_API_KEY: Joi.string().required(),
    NAVER_ACCESS_KEY: Joi.string().required(),
    NAVER_SECRET_KEY: Joi.string().required(),
    PHONE_NUMBER: Joi.string().required(),
  }),
});
