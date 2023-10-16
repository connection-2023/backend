import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'private',
          ContentType: file.mimetype,
        })
        .promise();
      return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }
}
