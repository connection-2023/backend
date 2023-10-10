import { DanceCategory } from '@src/common/enum/enum';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLecturerDto {
  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  youtubeUrl: string;

  @IsOptional()
  instagramUrl: string;

  @IsOptional()
  homepageUrl: string;

  @IsOptional()
  affiliation: string;

  @IsNotEmpty()
  introduction: string;

  @IsNotEmpty()
  experience: string;

  @IsArray()
  @IsNotEmpty()
  regions: string[];

  @IsArray()
  @IsEnum(DanceCategory, { each: true })
  @IsNotEmpty()
  genres: DanceCategory[];

  @IsArray()
  @IsOptional()
  websiteUrls: string[];

  @IsArray()
  @IsOptional()
  etcGenres: string[];
}
