import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { SMSData } from '../interface/interface';

@Injectable()
export class AuthService {
  private readonly sensUrl: string;
  private readonly sensApiKey: string;
  private readonly naverAccessKey: string;
  private readonly naverSecretKey: string;
  private readonly phoneNum: string;

  constructor(private readonly configService: ConfigService) {
    this.sensUrl = configService.get<string>('SENS_URL');
    this.sensApiKey = configService.get<string>('SENS_API_KEY');
    this.naverAccessKey = configService.get<string>('NAVER_ACCESS_KEY');
    this.naverSecretKey = configService.get<string>('NAVER_Secret_KEY');
    this.phoneNum = configService.get<string>('PHONE_NUMBER');
  }
  async sendSMS(phoneNumber): Promise<void> {
    const signature: string = this.createSensSignature();
    const randomNumber: string = this.createRandomNumber();

    const data: SMSData = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: this.phoneNum,
      content: `강사 등록을 위한 인증번호는 [${randomNumber}] 입니다.`,
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': Date.now().toString(),
      'x-ncp-iam-access-key': this.naverAccessKey,
      'x-ncp-apigw-signature-v2': signature,
    };

    try {
      await axios.post(`${this.sensUrl}`, data, {
        headers,
      });
    } catch (error) {
      console.error(error.response.data);
      throw new InternalServerErrorException(error.response.data);
    }
  }

  private createSensSignature(): string {
    const timeStamp = Date.now().toString();
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
}
