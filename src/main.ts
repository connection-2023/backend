import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  const prisma: PrismaService = app.get(PrismaService);
  prisma.enableShutdownHook(app);

  await app.listen(3000);
}
bootstrap();
