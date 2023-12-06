import { Admin } from '@prisma/client';

export class AdminDto implements Admin {
  id: number;
  name: string;
  nickname: string;
  email: string;
  profileImage: string | null;

  constructor(admin: Admin) {
    this.id = admin.id;
    this.nickname = admin.nickname;
    this.profileImage = admin.profileImage;

    Object.seal(this);
  }
}
