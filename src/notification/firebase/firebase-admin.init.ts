import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export class FirebaseAdminInitializer {
  constructor(private configService: ConfigService) {
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

    const serviceAccount = JSON.parse(firebaseAdminSDKJSON);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
