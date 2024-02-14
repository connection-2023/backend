import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/prisma/prisma.service';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from '@src/common/interceptors/success.interceptor';
import { WebhookService } from './webhook/services/webhook.service';
import { HttpNestInternalServerErrorExceptionFilter } from './common/exceptions/http-nest-internal-server-error-excetion.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from './common/exceptions/http-node-internal-server-error.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');
  const webhookService = app.get<WebhookService>(WebhookService);

  app.useGlobalInterceptors(
    app.get<SuccessInterceptor>(SuccessInterceptor),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableCors({
    origin: configService.get<string>('FRONT_END_URL'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new HttpNestInternalServerErrorExceptionFilter(webhookService),
    // new HttpNodeInternalServerErrorExceptionFilter(webhookService),
    new HttpExceptionFilter(),
  );

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  const JSON_PATH = 'api-docs-json';
  const YAML_PATH = 'api-docs-yaml';
  const config = new DocumentBuilder()
    .setTitle('connection')
    .setDescription(
      'Connection api description</br>' +
        `<strong><a target="_black" href="${JSON_PATH}">JSON document</a></strong></br>` +
        `<strong><a target="_black" href="${YAML_PATH}">YAML document</a></strong></br>`,
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: JSON_PATH,
    yamlDocumentUrl: YAML_PATH,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use(cookieParser());

  const prisma: PrismaService = app.get(PrismaService);
  prisma.enableShutdownHook(app);

  await app.listen(port);
}
bootstrap();
