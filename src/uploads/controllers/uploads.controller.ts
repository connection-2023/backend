import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@src/uploads/services/uploads.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteImageDto } from '@src/uploads/dtos/delete-image.dto';
import { ApiUploadS3Images } from '@src/uploads/swagger-decorators/upload-s3-images-decorator';
import { ApiUploadS3Image } from '@src/uploads/swagger-decorators/upload-s3-image-decorator';

@ApiTags('파일 업로드')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @ApiUploadS3Image()
  @UseInterceptors(FileInterceptor('image'))
  @Post(':folder/image')
  async uploadS3Image(
    @Param('folder') folder: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = await this.uploadsService.uploadFileToS3(folder, image);

    return { imageUrl };
  }

  @ApiUploadS3Images()
  @UseInterceptors(FilesInterceptor('images', 5))
  @Post('/:folder/images')
  async uploadS3Images(
    @Param('folder') folder: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const imageUrls: string[] = [];

    for (const image of images) {
      const url = await this.uploadsService.uploadFileToS3(folder, image);

      imageUrls.push(url);
    }

    return { imageUrls };
  }

  @ApiOperation({ summary: '이미지 삭제' })
  @Delete()
  async deleteS3Image(@Body() deleteImageDto: DeleteImageDto) {
    const { imageUrl } = deleteImageDto;
    const urlParts = imageUrl.split('/');
    const bucketName = urlParts[2];
    const imageKey = urlParts.slice(3).join('/');

    await this.uploadsService.deleteS3Object(imageKey);
  }
}
