interface LecturerInputData {
  userId: number;
  nickname: string;
  email: string;
  phoneNumber: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  homepageUrl?: string;
  affiliation?: string;
  introduction: string;
  experience: string;
}

interface LecturerRegionInputData {
  lecturerId: number;
  regionId: number;
}

interface LecturerWebsiteInputData {
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

interface WebsiteUrl {
  id: number;
  lecturerId: number;
  url: string;
}

interface ProfileImageUrl {
  id: number;
  lecturerId: number;
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
  lecturerWebsiteUrl: WebsiteUrl[];
  lecturerProfileImageUrl: ProfileImageUrl[];
}

export {
  LecturerInputData,
  LecturerRegionInputData,
  LecturerWebsiteInputData,
  LecturerDanceGenreInputData,
  LecturerProfileImageInputData,
  LecturerCoupon,
  LecturerProfile,
};
