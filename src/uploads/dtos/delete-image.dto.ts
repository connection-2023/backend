import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageDto {
  @ApiProperty({
    example: 'https://test/123fkdjs.png',
    description: '이미지 Url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
