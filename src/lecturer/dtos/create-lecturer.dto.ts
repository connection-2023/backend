import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsNotEmpty()
  genres: string[];

  @IsArray()
  @IsOptional()
  websiteUrls: string[];
}
