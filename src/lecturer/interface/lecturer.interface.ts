import { LectureInputData } from '@src/lecture/interface/lecture.interface';

interface LecturerInputData {
  userId: number;
  nickname: string;
  email: string;
  phoneNumber: string;
  introduction: string;
  profileCardImageUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  experience?: string;
}

interface LecturerUpdateData {
  profileImageCardUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  introduction: string;
  experience?: string;
}

interface LecturerRegionInputData {
  lecturerId: number;
  regionId: number;
}

interface LecturerInstagramPostInputData {
  lecturerId: number;
  url: string;
}

interface LecturerDanceGenreInputData {
  lecturerId: number;
  danceCategoryId: number;
  name?: string;
}

interface LecturerProfileImageInputData {
  lecturerId: number;
  url: string;
}
interface LecturerCoupon {
  id: number;
  title: string;
  percentage: number;
  discountPrice: number;
  isStackable: boolean;
  maxDiscountPrice: number;
  startAt: Date;
  endAt: Date;
}

interface LecturerRegion {
  region: {
    administrativeDistrict: string;
    district: string;
  };
}

interface LecturerDanceGenre {
  name: string | null;
  danceCategory: {
    genre: string;
  };
}

interface Url {
  url: string;
}

interface LecturerProfile {
  nickname: string;
  email: string;
  phoneNumber: string;
  youtubeUrl: string;
  instagramUrl: string;
  homepageUrl: string;
  affiliation: string;
  introduction: string;
  experience: string;
  lecturerRegion: LecturerRegion[];
  lecturerDanceGenre: LecturerDanceGenre[];
  lecturerInstagramPostUrl: Url[];
  lecturerProfileImageUrl: Url[];
}
interface LecturerProfileImageUpdateData {
  lecturerId: number;
  url: string;
}

export {
  LecturerInputData,
  LecturerRegionInputData,
  LecturerInstagramPostInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
  LecturerProfile,
  LecturerProfileImageUpdateData,
  LecturerUpdateData,
};
