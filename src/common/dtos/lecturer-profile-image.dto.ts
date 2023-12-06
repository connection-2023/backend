import { LecturerProfileImageUrl, Users } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { UserProfileImageDto } from './user-profile-image.dto';

export class LecturerProfileImageDto implements LecturerProfileImageUrl {
  id: number;
  lecturerId: number;
  url: string;

  constructor(lecturerProfileImage: Partial<LecturerProfileImageUrl>) {
    this.id = lecturerProfileImage.id;
    this.url = lecturerProfileImage.url;

    Object.seal(this);
  }
}
