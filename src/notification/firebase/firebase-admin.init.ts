import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FirebaseAdminInitializer implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    const firebaseAdminSDKJSON = this.configService.get<string>(
      'FIREBASE_ADMIN_SDK_JSON',
    );
    if (!firebaseAdminSDKJSON) {
      throw new Error(
        'Firebase Admin SDK JSON is not defined in the environment variables.',
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(firebaseAdminSDKJSON);
    } catch (error) {
      throw new Error(
        'Failed to parse Firebase Admin SDK JSON from environment variables.',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
