import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteImageDto } from './dtos/delete-image.dto';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post(':folders')
  async uploadS3Image(
    @Param('folders') folders: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = await this.uploadsService.uploadFileToS3(folders, image);

    return { imageUrl };
  }

  @ApiOperation({ summary: '이미지 삭제' })
  @Delete()
  async deleteS3Image(@Body() deleteImageDto: DeleteImageDto) {
    const { imageUrl } = deleteImageDto;
    const urlParts = imageUrl.split('/');
    const bucketName = urlParts[2];
    const imageKey = urlParts.slice(3).join('/');

    const deleteImage = await this.uploadsService.deleteS3Object(imageKey);

    return deleteImage;
  }
}
