import { Lecturer } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';

export class LecturerDto extends BaseReturnDto implements Lecturer {
  id: number;
  userId: number;
  nickname: string;
  email: string;
  phoneNumber: string;
  profileCardImageUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  homepageUrl: string;
  affiliation: string;
  introduction: string;
  experience: string;
  stars: number;
  reviewCount: number;
  deletedAt: Date;

  constructor(lecturer: Partial<LecturerDto>) {
    super();
  }
}
