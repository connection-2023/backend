import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FirebaseAdminInitializer implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeFirebaseAdmin();
  }

  private async initializeFirebaseAdmin() {
    const serviceAccount: admin.ServiceAccount = {
      projectId: this.configService.get<string>(
        'FIREBASE_ADMIN_SDK_PROJECT_ID',
      ),
      privateKey: this.configService
        .get<string>('FIREBASE_ADMIN_SDK_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>(
        'FIREBASE_ADMIN_SDK_CLIENT_EMAIL',
      ),
    };

    if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
      throw new Error(
        'Firebase Admin SDK credentials are not fully defined in the environment variables.',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
