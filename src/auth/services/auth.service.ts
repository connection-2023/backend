import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import {
  AxiosPostResult,
  Payload,
  SMSData,
  SelectedDailyUsage,
} from '@src/auth/interface/interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CheckVerificationCodeDto } from '@src/auth/dtos/check-verification-code.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { DailySmsUsage, Lecturer, Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@src/common/interface/common-interface';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  private sensUrl: string;
  private sensApiKey: string;
  private naverAccessKey: string;
  private naverSecretKey: string;
  private phoneNumber: string;
  private jwtAccessTokenExpiresIn: string;
  private jwtRefreshTokenExpiresIn: string;
  private jwtRefreshTokenTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.sensUrl = this.configService.get<string>('SENS_URL');
    this.sensApiKey = this.configService.get<string>('SENS_API_KEY');
    this.naverAccessKey = this.configService.get<string>('NAVER_ACCESS_KEY');
    this.naverSecretKey = this.configService.get<string>('NAVER_Secret_KEY');
    this.phoneNumber = this.configService.get<string>('PHONE_NUMBER');

    this.logger.log('AuthService Init');
  }

  async sendVerificationCode(
    userId: number,
    userPhoneNumber: string,
  ): Promise<void> {
    try {
      const dailyUsage: SelectedDailyUsage | DailySmsUsage =
        await this.getOrCreateDailyUsage(userId);

      this.checkDailySentCount(dailyUsage);

      await this.cacheManager.del(`${this.phoneNumber}`);

      const randomNumber: string = this.createRandomNumber();
      const result: AxiosPostResult = await this.sendSMS(
        randomNumber,
        userPhoneNumber,
      );

      if (!result.status) {
        await this.handleFailedSMSAttempt(userId);
        throw new UnauthorizedException(result.error);
      }

      await this.cacheRandomNumber(userPhoneNumber, randomNumber);
      await this.incrementDailySentCount(userId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async getOrCreateDailyUsage(
    userId: number,
  ): Promise<SelectedDailyUsage | DailySmsUsage> {
    const dailyUsage = await this.prismaService.dailySmsUsage.findUnique({
      where: { userId },
      select: { id: true, dailySentCount: true },
    });

    if (!dailyUsage) {
      return this.prismaService.dailySmsUsage.create({
        data: { userId },
      });
    }

    return dailyUsage;
  }

  private checkDailySentCount(dailyUsage: SelectedDailyUsage | DailySmsUsage) {
    if (
      dailyUsage.dailySentCount >=
      this.configService.get<number>('SMS_USAGE_LIMIT')
    ) {
      throw new BadRequestException(`일일 인증 횟수를 초과했습니다.`);
    }
  }

  private async handleFailedSMSAttempt(userId: number) {
    await this.prismaService.dailySmsUsage.updateMany({
      where: { userId, dailySentCount: { gte: 1 } },
      data: { dailySentCount: { increment: -1 } },
    });
  }

  private async cacheRandomNumber(
    userPhoneNumber: string,
    randomNumber: string,
  ) {
    await this.cacheManager.set(
      `${userPhoneNumber}`,
      randomNumber,
      this.configService.get<number>('REDIS_SMS_TTL'),
    );
  }

  private async incrementDailySentCount(userId: number) {
    await this.prismaService.dailySmsUsage.update({
      where: { userId },
      data: { dailySentCount: { increment: 1 } },
    });
  }

  private async sendSMS(
    randomNumber: string,
    userPhoneNumber: string,
  ): Promise<AxiosPostResult> {
    try {
      const timeStamp: string = Date.now().toString();
      const signature: string = this.createSensSignature(timeStamp);

      const data: SMSData = {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: this.phoneNumber,
        content: `강사 등록을 위한 인증번호는 [${randomNumber}] 입니다.`,
        messages: [
          {
            to: userPhoneNumber,
          },
        ],
      };
      await axios.post(`${this.sensUrl}`, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-apigw-timestamp': timeStamp,
          'x-ncp-iam-access-key': this.naverAccessKey,
          'x-ncp-apigw-signature-v2': signature,
        },
      });

      return { status: true };
    } catch (error) {
      return { status: false, error: error.response.data };
    }
  }

  private createSensSignature(timeStamp: string): string {
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = `/sms/v2/services/${this.sensApiKey}/messages`;

    let hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      this.naverSecretKey,
    );

    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timeStamp);
    hmac.update(newLine);
    hmac.update(this.naverAccessKey);
    var hash = hmac.finalize();

    return hash.toString(CryptoJS.enc.Base64);
  }

  private createRandomNumber(): string {
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    return randomNumber;
  }

  async checkVerificationCode({
    verificationCode,
    userPhoneNumber,
  }: CheckVerificationCodeDto): Promise<void> {
    const cachedVerificationCode = await this.cacheManager.get(userPhoneNumber);

    if (!cachedVerificationCode) {
      throw new UnauthorizedException('유효시간이 만료되었습니다.');
    }

    if (cachedVerificationCode !== verificationCode) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }
  }
}
