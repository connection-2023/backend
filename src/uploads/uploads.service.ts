import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private readonly s3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadImage(
    file: Express.Multer.File,
    kind: string,
    lectureId: number,
  ) {
    const key = `${kind}/${lectureId}/${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }
}
