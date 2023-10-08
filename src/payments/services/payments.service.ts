import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  private kftGetTokenUri: string;
  private kftClientId: string;
  private kftClientSecret: string;
  private kftScope: string;
  private kftGrantType: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.kftGetTokenUri = this.configService.get<string>('KFT_GET_TOKEN_URI');
    this.kftClientId = this.configService.get<string>('KFT_CLIENT_ID');
    this.kftClientSecret = this.configService.get<string>('KFT_CLIENT_SECRET');
    this.kftScope = this.configService.get<string>('KFT_SCOPE');
    this.kftGrantType = this.configService.get<string>('KFT_GRANT_TYPE');

    this.logger.log('PaymentsService Init');
  }

  async verifyBankAccount() {
    const accessToken = this.getKFTAccessToken();
  }

  private async getKFTAccessToken() {
    const data = {
      client_id: this.kftClientId,
      client_secret: this.kftClientSecret,
      scope: this.kftScope,
      grant_type: this.kftGrantType,
    };
    const response = await axios.post(this.kftGetTokenUri, data);
  }
}
