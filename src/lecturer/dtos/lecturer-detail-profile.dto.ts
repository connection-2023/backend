import { ApiProperty } from '@nestjs/swagger';
import { Lecturer } from '@prisma/client';
import { LecturerProfileImageDto } from '@src/common/dtos/lecturer-profile-image.dto';
import { LecturerInstagramPostUrlDto } from './lecturer-instagram-post-url.dto';
import { LecturerRegionDto } from '@src/common/dtos/lecturer-region.dto';
import { LecturerDanceGenreDto } from '@src/common/dtos/lecturer-dance-genre.dto';
import { BaseReturnWithSwaggerDto } from '@src/common/dtos/base-return-with-swagger.dto copy';

export class LecturerDetailProfileDto
  extends BaseReturnWithSwaggerDto
  implements Lecturer
{
  @ApiProperty({
    description: '강사id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    description: '전화번호',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '프로필 카드 이미지',
  })
  profileCardImageUrl: string;

  @ApiProperty({
    description: '유튜브',
  })
  youtubeUrl: string;

  @ApiProperty({
    description: '인스타',
  })
  instagramUrl: string;

  @ApiProperty({
    description: '홈페이지',
  })
  homepageUrl: string;

  @ApiProperty({
    description: '소속',
  })
  affiliation: string;

  @ApiProperty({
    description: '소개',
  })
  introduction: string;

  @ApiProperty({
    description: '경력',
  })
  experience: string;

  @ApiProperty({
    description: '별점',
  })
  stars: number;

  @ApiProperty({
    description: '리뷰 수',
  })
  reviewCount: number;
  userId: number;
  deletedAt: Date;

  @ApiProperty({
    type: Boolean,
    description: '좋아요 여부',
  })
  isLiked: boolean;

  @ApiProperty({
    description: '강사 춤 장르',
    type: LecturerDanceGenreDto,
    isArray: true,
    nullable: true,
  })
  lecturerDanceGenre?: LecturerDanceGenreDto[];

  @ApiProperty({
    description: '강사 활동 지역',
    type: LecturerRegionDto,
    isArray: true,
    nullable: true,
  })
  lecturerRegion?: LecturerRegionDto[];

  @ApiProperty({
    description: '강사의 프로필 이미지들',
    type: LecturerProfileImageDto,
    isArray: true,
    nullable: true,
  })
  lecturerProfileImageUrl?: LecturerProfileImageDto[];

  @ApiProperty({
    description: '강사의 인스타 게시물',
    type: LecturerInstagramPostUrlDto,
    nullable: true,
  })
  lecturerInstagramPostUrl?: LecturerInstagramPostUrlDto[];

  constructor(lecturer: Partial<LecturerDetailProfileDto>) {
    super();

    this.id = lecturer.id;
    this.nickname = lecturer.nickname;
    this.email = lecturer.email;
    this.phoneNumber = lecturer.phoneNumber;
    this.profileCardImageUrl = lecturer.profileCardImageUrl;
    this.youtubeUrl = lecturer.youtubeUrl;
    this.instagramUrl = lecturer.instagramUrl;
    this.homepageUrl = lecturer.homepageUrl;
    this.affiliation = lecturer.affiliation;
    this.introduction = lecturer.introduction;
    this.experience = lecturer.experience;
    this.stars = lecturer.stars;
    this.reviewCount = lecturer.reviewCount;
    this.createdAt = lecturer.createdAt;
    this.updatedAt = lecturer.updatedAt;
    this.isLiked = lecturer.isLiked;

    this.lecturerDanceGenre = lecturer.lecturerDanceGenre
      ? lecturer.lecturerDanceGenre.map(
          (dance) => new LecturerDanceGenreDto(dance),
        )
      : null;

    this.lecturerRegion = lecturer.lecturerRegion
      ? lecturer.lecturerRegion.map((region) => new LecturerRegionDto(region))
      : null;

    this.lecturerProfileImageUrl = lecturer.lecturerProfileImageUrl
      ? lecturer.lecturerProfileImageUrl.map(
          (Profile) => new LecturerProfileImageDto(Profile),
        )
      : null;

    this.lecturerInstagramPostUrl = lecturer.lecturerInstagramPostUrl
      ? lecturer.lecturerInstagramPostUrl.map(
          (instagramPost) => new LecturerProfileImageDto(instagramPost),
        )
      : null;
  }
}
